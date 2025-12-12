import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  Trophy,
  Sword,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { Player } from "../types";
import { Button } from "./Button";

interface SetupScreenProps {
  participants: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onClearAll: () => void;
  onStartTournament: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  participants,
  onAddPlayer,
  onRemovePlayer,
  onClearAll,
  onStartTournament,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onAddPlayer(inputValue.trim());
      setInputValue("");
    }
  };

  const handleClearClick = () => {
    if (isConfirmingClear) {
      onClearAll();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      // Auto-reset confirmation state after 3 seconds if not clicked again
      setTimeout(() => setIsConfirmingClear(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 animate-fade-in font-sans">
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-full bg-blood-900/30 mb-4 border border-blood-600/50">
          <Sword className="w-12 h-12 text-blood-500" />
        </div>
        <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 uppercase tracking-tight drop-shadow-sm">
          Hội Sát Thủ Phong Ảnh Sát
        </h1>
        <p className="text-blood-500 font-bold tracking-widest text-sm uppercase">
          Giải đấu PvP sinh tử dành cho những sát thủ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blood-600 to-transparent"></div>

          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blood-500" />
            Đăng Ký Sát Thủ
          </h2>

          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập mật danh..."
              className="flex-1 bg-black/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-blood-600 transition-colors font-sans"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gray-800 hover:bg-blood-600 text-white p-3 transition-colors border border-gray-700 hover:border-blood-500 disabled:opacity-50"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>

          <div className="text-gray-500 text-sm font-sans leading-relaxed">
            * Cần tối thiểu 2 sát thủ để bắt đầu giải đấu.
            <br />* Hệ thống sẽ tự động thêm "BYE" nếu số lượng không cân bằng.
          </div>
        </div>

        {/* List Section */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm flex flex-col h-[500px] shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Danh Sách ({participants.length})
            </h2>
            {participants.length > 0 && (
              <button
                type="button"
                onClick={handleClearClick}
                className={`
                  px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2 border
                  ${
                    isConfirmingClear
                      ? "bg-red-600 text-white border-red-500 animate-pulse"
                      : "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40 hover:border-red-500 hover:text-red-400"
                  }
                `}
              >
                {isConfirmingClear ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    Xác nhận xóa?
                  </>
                ) : (
                  <>
                    <Trash className="w-3 h-3" />
                    Xóa tất cả
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 font-sans text-sm border-2 border-dashed border-gray-800 rounded-lg">
                <p>Chưa có sát thủ nào đăng ký</p>
              </div>
            ) : (
              participants.map((player) => (
                <div
                  key={player.id}
                  className="group flex items-center justify-between bg-black/40 border border-gray-800 p-3 hover:border-blood-600/50 transition-all hover:bg-blood-900/10 rounded-md"
                >
                  <span className="font-sans text-gray-200 font-bold group-hover:text-blood-400 transition-colors">
                    {player.name}
                  </span>
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="text-gray-600 hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Button
              onClick={onStartTournament}
              disabled={participants.length < 2}
              className="w-full"
            >
              Bắt Đầu Giải Đấu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
