import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/baseDatos.js';

const RONDAS_SALT = 12;

// Registro de usuario (auth local)
export const registrar = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { email, contrasena, nombre } = req.body;

    // Validar formato de email
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({
        error: 'EMAIL_INVALIDO',
        mensaje: 'Formato de email inválido'
      });
    }

    // Validar nombre de usuario
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({
        error: 'NOMBRE_REQUERIDO',
        mensaje: 'El nombre de usuario es requerido'
      });
    }

    const regexNombreUsuario = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    if (!regexNombreUsuario.test(nombre)) {
      if (nombre.length < 3) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
      } else if (nombre.length > 20) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario no puede tener más de 20 caracteres'
        });
      } else if (!/^[a-zA-Z]/.test(nombre)) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario debe comenzar con una letra'
        });
      } else {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario solo puede contener letras, números, guiones (-) y guiones bajos (_)'
        });
      }
    }

    // Validar contraseña
    if (contrasena.length < 8) {
      return res.status(400).json({
        error: 'CONTRASENA_DEBIL',
        mensaje: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    if (!/[A-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      return res.status(400).json({
        error: 'CONTRASENA_DEBIL',
        mensaje: 'La contraseña debe contener al menos una mayúscula y un número'
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await cliente.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'EMAIL_EXISTE',
        mensaje: 'Este email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashContrasena = await bcrypt.hash(contrasena, RONDAS_SALT);

    // Iniciar transacción
    await cliente.query('BEGIN');

    // Crear usuario (auto-verificado con auth local)
    const resultado = await cliente.query(
      `INSERT INTO usuarios (
        email, 
        hash_contrasena, 
        nombre, 
        proveedor_auth, 
        esta_verificado
      )
      VALUES ($1, $2, $3, 'local', true)
      RETURNING id, email, nombre, creado_en`,
      [email.toLowerCase(), hashContrasena, nombre]
    );

    const nuevoUsuario = resultado.rows[0];

    // Commit de la transacción
    await cliente.query('COMMIT');

    // Generar JWT automáticamente
    const token = jwt.sign(
      { usuarioId: nuevoUsuario.id, email: nuevoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre
      }
    });

  } catch (error) {
    await cliente.query('ROLLBACK');
    console.error('Error en registrar:', error);

    // Manejar error de constraint único (race condition)
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'EMAIL_EXISTE',
        mensaje: 'Este email ya está registrado'
      });
    }

    res.status(500).json({
      error: 'REGISTRO_FALLO',
      mensaje: 'Error al registrar usuario'
    });
  } finally {
    cliente.release();
  }
};

// Login
export const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({
        error: 'CREDENCIALES_FALTANTES',
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    const resultado = await pool.query(
      'SELECT id, email, hash_contrasena, nombre, avatar_url, proveedor_auth FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        error: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    const usuario = resultado.rows[0];

    // Verificar que sea usuario local (no OAuth)
    if (usuario.proveedor_auth !== 'local') {
      return res.status(400).json({
        error: 'METODO_AUTH_INCORRECTO',
        mensaje: `Esta cuenta usa autenticación con ${usuario.proveedor_auth}. Por favor inicia sesión con ${usuario.proveedor_auth}.`
      });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.hash_contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        error: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { usuarioId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        avatarUrl: usuario.avatar_url,
        proveedorAuth: usuario.proveedor_auth
      }
    });

  } catch (error) {
    console.error('Error en iniciarSesion:', error);
    res.status(500).json({
      error: 'LOGIN_FALLO',
      mensaje: 'Error al iniciar sesión'
    });
  }
};

// Obtener usuario actual
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, email, nombre, avatar_url, proveedor_auth, creado_en FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'USUARIO_NO_ENCONTRADO',
        mensaje: 'Usuario no encontrado'
      });
    }

    const usuario = resultado.rows[0];

    res.json({ 
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        avatarUrl: usuario.avatar_url,
        proveedorAuth: usuario.proveedor_auth,
        creadoEn: usuario.creado_en
      }
    });

  } catch (error) {
    console.error('Error en obtenerUsuarioActual:', error);
    res.status(500).json({
      error: 'OBTENER_USUARIO_FALLO',
      mensaje: 'Error al obtener usuario'
    });
  }
};
