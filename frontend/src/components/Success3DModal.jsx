import React, { useEffect } from "react";
import { Check, Gem, Sparkles } from "lucide-react";

export default function Success3DModal({ isOpen, onClose, title = "Success!", subtitle = "Action completed successfully" }) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-3d-backdrop" onClick={onClose}>
      <div className="modal-3d-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Floating background rays & particle sparkles */}
        <div className="modal-3d-sunburst" />
        <div className="modal-3d-sparkle sp-1"><Sparkles size={16} /></div>
        <div className="modal-3d-sparkle sp-2"><Gem size={14} /></div>
        <div className="modal-3d-sparkle sp-3"><Sparkles size={18} /></div>
        <div className="modal-3d-sparkle sp-4"><Gem size={15} /></div>

        <div className="modal-3d-card">
          {/* 3D Checkmark Orb with bounce and ring waves */}
          <div className="modal-3d-orb-container">
            <div className="modal-3d-pulse-ring ring-1"></div>
            <div className="modal-3d-pulse-ring ring-2"></div>
            <div className="modal-3d-orb">
              <div className="modal-3d-orb-shine"></div>
              <Check className="modal-3d-check-icon" size={44} strokeWidth={3.5} />
            </div>
          </div>

          <h3 className="modal-3d-title">{title}</h3>
          <p className="modal-3d-subtitle">{subtitle}</p>

          <div className="modal-3d-gold-bar"></div>

          <button className="modal-3d-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
