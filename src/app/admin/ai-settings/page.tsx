'use client';

import React, { useEffect, useState } from 'react';
import { aiSettingsApi } from '@/features/admin/api/aiSettingsApi';
import { Bot, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SYSTEM_PROMPT_KEY = 'AI_SYSTEM_PROMPT';
const SYSTEM_PROMPT_CONFIG_KEY = 'AI_SYSTEM_PROMPT_CONFIG';

interface AiConfig {
  role: string;
  tone: string;
  skills: string[];
  rules: string[];
}

const DEFAULT_CONFIG: AiConfig = {
  role: 'Trợ lý mua sắm ảo thông minh tại OCOP - Chuyên gia về đặc sản địa phương.',
  tone: 'Thân thiện, chuyên nghiệp, nhiệt tình, luôn sẵn sàng giúp đỡ khách hàng.',
  skills: [
    'Phân tích nhu cầu của khách hàng để gợi ý sản phẩm phù hợp.',
    'Cung cấp thông tin chi tiết về sản phẩm dựa vào dữ liệu RAG (Pinecone).',
  ],
  rules: [
    'LUÔN gọi khách hàng là "bạn" và xưng "tôi" hoặc "trợ lý OCOP".',
    'KHÔNG bịa đặt thông tin sản phẩm, nếu không biết thì nói không biết.',
    'LUÔN nhắc đến ngữ cảnh (SẢN PHẨM LIÊN QUAN) nếu có.',
  ],
};

export default function AiSettingsPage() {
  const [config, setConfig] = useState<AiConfig>(DEFAULT_CONFIG);
  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configStr = await aiSettingsApi.getSetting(SYSTEM_PROMPT_CONFIG_KEY);
        if (configStr) {
          try {
            const parsed = JSON.parse(configStr);
            setConfig({ ...DEFAULT_CONFIG, ...parsed });
          } catch (e) {
            console.error('Lỗi parse JSON cấu hình', e);
          }
        } else {
          // If no config exists, try to fetch the raw prompt and put it in role just in case
          const rawPrompt = await aiSettingsApi.getSetting(SYSTEM_PROMPT_KEY);
          if (rawPrompt) {
            setConfig((prev) => ({ ...prev, role: rawPrompt }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch AI Config:', error);
        toast.error('Không thể tải cấu hình AI.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    setPreviewText(generatePrompt(config));
  }, [config]);

  const generatePrompt = (c: AiConfig) => {
    return `Bạn đóng vai trò là: ${c.role}

Giọng điệu: ${c.tone}

KỸ NĂNG CỦA BẠN (SKILLS):
${c.skills.map((s) => `- ${s}`).join('\n')}

QUY TẮC BẮT BUỘC (RULES):
${c.rules.map((r) => `- ${r}`).join('\n')}

LƯU Ý QUAN TRỌNG: Hãy sử dụng thông tin trong [SẢN PHẨM LIÊN QUAN] được hệ thống tự động chèn vào cuối prompt (nếu có) để trả lời khách hàng.`;
  };

  const handleSave = async () => {
    if (!config.role.trim()) {
      toast.error('Vai trò không được để trống!');
      return;
    }

    setIsSaving(true);
    try {
      const compiledPrompt = generatePrompt(config);

      // Lưu Markdown cho Backend xài
      await aiSettingsApi.updateSetting(SYSTEM_PROMPT_KEY, {
        value: compiledPrompt,
        description: 'Cấu hình System Prompt (compiled) cho Chatbot AI',
      });

      // Lưu JSON Config cho UI dùng
      await aiSettingsApi.updateSetting(SYSTEM_PROMPT_CONFIG_KEY, {
        value: JSON.stringify(config),
        description: 'Trạng thái UI Cấu hình AI',
      });

      toast.success('Đã lưu cấu hình AI Chatbot thành công!');
    } catch (error) {
      console.error('Failed to update AI System Prompt:', error);
      toast.error('Lưu cấu hình thất bại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    setConfig({ ...config, skills: [...config.skills, ''] });
  };
  const handleUpdateSkill = (index: number, val: string) => {
    const newSkills = [...config.skills];
    newSkills[index] = val;
    setConfig({ ...config, skills: newSkills });
  };
  const handleRemoveSkill = (index: number) => {
    setConfig({ ...config, skills: config.skills.filter((_, i) => i !== index) });
  };

  const handleAddRule = () => {
    setConfig({ ...config, rules: [...config.rules, ''] });
  };
  const handleUpdateRule = (index: number, val: string) => {
    const newRules = [...config.rules];
    newRules[index] = val;
    setConfig({ ...config, rules: newRules });
  };
  const handleRemoveRule = (index: number) => {
    setConfig({ ...config, rules: config.rules.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thiết lập AI (System Prompt)</h1>
            <p className="text-sm text-gray-500">
              Định hình nhân vật và quy tắc hành xử cho trợ lý OCOP
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-blue-50/50 p-4 border-b border-gray-100 flex items-start gap-3 text-blue-800">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">
              Mọi thay đổi ở đây sẽ tự động được biên dịch thành{' '}
              <strong>System Prompt Markdown</strong> và được hệ thống sử dụng ngay lập tức cho các
              đoạn chat mới.
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Vai trò */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Nhân vật / Vai trò (Role)
              </label>
              <textarea
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                className="w-full min-h-[80px] rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Ví dụ: Bạn là trợ lý OCOP thông minh..."
                disabled={isLoading || isSaving}
              />
            </div>

            {/* Giọng điệu */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Giọng điệu (Tone)
              </label>
              <input
                type="text"
                value={config.tone}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Ví dụ: Lịch sự, thân thiện, hài hước..."
                disabled={isLoading || isSaving}
              />
            </div>

            {/* Kỹ năng */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Kỹ năng (Skills)
                </label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={isLoading || isSaving}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                >
                  <Plus size={14} /> Thêm kỹ năng
                </button>
              </div>
              <div className="space-y-3">
                {config.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleUpdateSkill(index, e.target.value)}
                      className="flex-1 rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Nhập mô tả kỹ năng..."
                      disabled={isLoading || isSaving}
                    />
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      disabled={isLoading || isSaving}
                      className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quy tắc */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Quy tắc cấm / Bắt buộc (Rules)
                </label>
                <button
                  type="button"
                  onClick={handleAddRule}
                  disabled={isLoading || isSaving}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                >
                  <Plus size={14} /> Thêm quy tắc
                </button>
              </div>
              <div className="space-y-3">
                {config.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleUpdateRule(index, e.target.value)}
                      className="flex-1 rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Nhập quy tắc..."
                      disabled={isLoading || isSaving}
                    />
                    <button
                      onClick={() => handleRemoveRule(index)}
                      disabled={isLoading || isSaving}
                      className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="lg:w-[400px] shrink-0">
        <div className="sticky top-6 rounded-2xl border border-gray-200 bg-gray-900 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-6rem)]">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between shrink-0 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Bot size={16} className="text-emerald-400" />
              Preview Markdown
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-[13px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
              {previewText}
            </pre>
          </div>
          <div className="bg-gray-800 p-4 border-t border-gray-700 shrink-0">
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              <Save size={18} />
              {isSaving ? 'Đang lưu...' : 'Lưu cấu hình AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
