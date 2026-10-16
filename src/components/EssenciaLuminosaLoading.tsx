import React from 'react';
import { Leaf } from 'lucide-react';
import { APPROVED_LOGO_DATA_URI, APPROVED_LOGO_ALT } from './ApprovedBrand';
export default function EssenciaLuminosaLoading() {
  return <main id="auth-loading-view" className="el-loading" aria-busy="true" aria-label="Carregando Protocolo da Transformação">
    <div className="el-loading-frame" aria-hidden="true" />
    <div className="el-loading-content">
      <img className="el-loading-logo" src={APPROVED_LOGO_DATA_URI} alt={APPROVED_LOGO_ALT} />
      <h1 className="el-loading-title">Protocolo da Transformação</h1>
      <div className="el-loading-divider" aria-hidden="true"><span /><Leaf size={26} strokeWidth={1.2} /><span /></div>
      <p className="el-loading-quote">Cuidar de si também<br />é um ato de amor.</p>
      <div className="el-loading-status" role="status" aria-live="polite"><span className="el-loading-track" aria-hidden="true"><span /></span><p>Carregando sua jornada...</p></div>
    </div>
  </main>;
}
