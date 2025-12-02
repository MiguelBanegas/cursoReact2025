import React from 'react';
import { appInfo } from '../config/versionInfo';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '24px' }}>🏍️</span>
            <h3 className="m-0" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              {appInfo.name}
            </h3>
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="version-badge">
            Versión {appInfo.version}
          </div>
          
          <p className="description">
            {appInfo.description}
          </p>

          <div className="changelog-section">
            <h4>Novedades</h4>
            <div className="changelog-list">
              {appInfo.changelog.map((log, index) => (
                <div key={index} className="changelog-item">
                  <div className="changelog-header">
                    <span className="version">{log.version}</span>
                    <span className="date">{log.date}</span>
                  </div>
                  <ul>
                    {log.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p className="copyright">© 2025 MAB Motors. Todos los derechos reservados.</p>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 28px;
          color: #666;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #333;
        }

        .version-badge {
          display: inline-block;
          background: #f0f2f5;
          color: #667eea;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .description {
          color: #555;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .changelog-section h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }

        .changelog-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .changelog-item {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #667eea;
        }

        .changelog-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }

        .changelog-header .version {
          font-weight: 700;
          color: #333;
        }

        .changelog-header .date {
          color: #888;
        }

        .changelog-item ul {
          margin: 0;
          padding-left: 20px;
          font-size: 0.9rem;
          color: #555;
        }

        .changelog-item li {
          margin-bottom: 4px;
        }

        .modal-footer {
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .copyright {
          color: #999;
          font-size: 0.8rem;
          margin: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AboutModal;
