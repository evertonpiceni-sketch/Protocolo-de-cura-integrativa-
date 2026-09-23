import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F4EC',
          color: '#2A2420',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#FAF4E8',
            border: '1.5px solid #B88736',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>✨</span>
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600, color: '#2A2420' }}>
            Estamos reconectando seu espaço
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#5C5248', maxWidth: '320px', lineHeight: '1.5' }}>
            Houve uma oscilação passageira na conexão. Clique abaixo para reiniciar com tranquilidade.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: '#B88736',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Recarregar Aplicação
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch (e) {}
                window.location.reload();
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#8F631E',
                border: '1px solid #E5DAC6',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Limpar Dados Locais & Recarregar
            </button>
          </div>
          {this.state.error && (
            <details style={{ marginTop: '24px', textAlign: 'left', maxWidth: '400px', fontSize: '11px', color: '#85786C' }}>
              <summary style={{ cursor: 'pointer' }}>Detalhes técnicos</summary>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '8px', padding: '8px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DAC6' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return (this as any).props.children;
  }
}
