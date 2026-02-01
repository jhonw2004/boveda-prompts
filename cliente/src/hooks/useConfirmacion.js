import { useState } from 'react';

export const useConfirmacion = () => {
  const [estado, setEstado] = useState({
    abierto: false,
    titulo: '',
    mensaje: '',
    tipo: 'warning',
    textoConfirmar: 'Confirmar',
    textoCancelar: 'Cancelar',
    cargando: false,
    onConfirmar: null
  });

  const mostrar = ({
    titulo,
    mensaje,
    tipo = 'warning',
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    onConfirmar
  }) => {
    return new Promise((resolve) => {
      setEstado({
        abierto: true,
        titulo,
        mensaje,
        tipo,
        textoConfirmar,
        textoCancelar,
        cargando: false,
        onConfirmar: async () => {
          if (onConfirmar) {
            setEstado(prev => ({ ...prev, cargando: true }));
            try {
              await onConfirmar();
              resolve(true);
            } catch (error) {
              resolve(false);
            } finally {
              cerrar();
            }
          } else {
            resolve(true);
            cerrar();
          }
        }
      });
    });
  };

  const cerrar = () => {
    setEstado(prev => ({ ...prev, abierto: false, cargando: false }));
  };

  const confirmar = async () => {
    if (estado.onConfirmar) {
      await estado.onConfirmar();
    }
  };

  return {
    estado,
    mostrar,
    cerrar,
    confirmar
  };
};
