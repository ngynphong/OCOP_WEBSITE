'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAiChat } from '../hooks/useAiChat';
import {
  X,
  Send,
  Loader2,
  ShoppingCart,
  CreditCard,
  Heart,
  HeartOff,
  Package,
  Ticket,
  MessageSquare,
  Bell,
  User,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useSaveVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import { useRouter } from 'next/navigation';
import { publicProductApi } from '@/features/products/api/publicProductApi';
import { cartApi } from '@/features/cart/api/cartApi';
import { setSelection } from '@/store/features/cartSlice';
import toast from 'react-hot-toast';

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useAiChat();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { mutate: addToCart, mutateAsync: addToCartAsync } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { saveVoucher } = useSaveVoucherMutations();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Lắng nghe sự kiện từ SearchBox
  useEffect(() => {
    const handleOpenAiChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (!isAuthenticated) {
        toast.error('Vui lòng đăng nhập để trò chuyện với OCOP Support');
        return;
      }
      setIsOpen(true);
      if (customEvent.detail?.message && !isLoading) {
        sendMessage(customEvent.detail.message);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenAiChat);
    return () => {
      window.removeEventListener('open-ai-chat', handleOpenAiChat);
    };
  }, [sendMessage, isLoading, isAuthenticated, router]);

  // Auto-resize textarea when input changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-10 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <div
        className={`overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out border border-gray-100 flex flex-col absolute bottom-0 right-0 ${
          isOpen
            ? 'h-[500px] max-h-[calc(100vh-10rem)] w-[360px] max-w-[calc(100vw-3rem)] opacity-100 translate-y-0'
            : 'h-0 w-[360px] max-w-[calc(100vw-3rem)] opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white backdrop-blur-sm">
              <Image
                src="/images/chatbot.png"
                alt="Logo"
                width={80}
                height={80}
                className="absolute w-[120%] h-[120%] max-w-none object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">OCOP Support</h3>
              <p className="text-xs text-emerald-100">AI Trợ lý mua sắm</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-emerald-50/30">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-gray-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Image
                  src="/images/chatbot.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="absolute w-[120%] h-[120%] max-w-none object-contain"
                />
              </div>
              <div className="max-w-[200px]">
                <p className="text-sm font-medium text-gray-700">Xin chào! 👋</p>
                <p className="text-xs mt-1">
                  Tôi là trợ lý ảo AI. Tôi có thể giúp bạn tìm kiếm đặc sản OCOP hoặc tư vấn mua
                  hàng.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm border border-emerald-100 rounded-bl-sm'
                    } ${msg.isError ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                  >
                    {msg.role === 'assistant' && !msg.content && msg.isStreaming && (
                      <div className="flex items-center space-x-1 h-5 px-1">
                        <div
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.content && (
                      <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100 max-w-none break-words">
                        <ReactMarkdown
                          urlTransform={(url) => url}
                          components={{
                            a: ({ href, children, ...props }) => {
                              if (href?.startsWith('action://add-to-cart')) {
                                const match = href.match(/productId=([^&]+)/);
                                const productId = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      if (productId) {
                                        try {
                                          const resp = await publicProductApi.getProduct(
                                            Number(productId),
                                          );
                                          const product = resp.data;
                                          const defaultVariant =
                                            product.variants?.find((v) => v.isDefault) ||
                                            product.variants?.[0];
                                          if (defaultVariant) {
                                            addToCart({ variantId: defaultVariant.id, qty: 1 });
                                          } else {
                                            toast.error('Sản phẩm chưa có phân loại hàng.');
                                          }
                                        } catch (error) {
                                          console.error(error);
                                          toast.error(
                                            'Không thể thêm sản phẩm vào giỏ hàng lúc này.',
                                          );
                                        }
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 my-1 mx-1 transition-colors"
                                  >
                                    <ShoppingCart size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://add-favorite')) {
                                const match = href.match(/productId=([^&]+)/);
                                const productId = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (productId) {
                                        addToWishlist(Number(productId));
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200 my-1 mx-1 transition-colors"
                                  >
                                    <Heart size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://remove-favorite')) {
                                const match = href.match(/productId=([^&]+)/);
                                const productId = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (productId) {
                                        removeFromWishlist(Number(productId));
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 my-1 mx-1 transition-colors"
                                  >
                                    <HeartOff size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://buy-now')) {
                                const match = href.match(/productId=([^&]+)/);
                                const productId = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      if (productId) {
                                        try {
                                          const resp = await publicProductApi.getProduct(
                                            Number(productId),
                                          );
                                          const product = resp.data;
                                          const defaultVariant =
                                            product.variants?.find((v) => v.isDefault) ||
                                            product.variants?.[0];
                                          if (defaultVariant) {
                                            const cartResp = await addToCartAsync({
                                              variantId: defaultVariant.id,
                                              qty: 1,
                                            });
                                            const addedItem = cartResp?.data?.items?.find(
                                              (item) => item.variantId === defaultVariant.id,
                                            );
                                            if (addedItem) {
                                              dispatch(setSelection([addedItem.id]));
                                              setIsOpen(false);
                                              router.push('/checkout');
                                            } else {
                                              toast.error(
                                                'Không tìm thấy sản phẩm trong giỏ hàng.',
                                              );
                                            }
                                          } else {
                                            toast.error('Sản phẩm chưa có phân loại hàng.');
                                          }
                                        } catch (error) {
                                          console.error(error);
                                          toast.error('Không thể xử lý yêu cầu lúc này.');
                                        }
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 my-1 mx-1 transition-colors shadow-sm"
                                  >
                                    <ShoppingCart size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://checkout')) {
                                return (
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      try {
                                        const resp = await cartApi.getCart();
                                        const itemIds =
                                          resp.data?.items?.map((item) => item.id) || [];
                                        if (itemIds.length === 0) {
                                          toast.error('Giỏ hàng của bạn đang trống.');
                                          return;
                                        }
                                        dispatch(setSelection(itemIds));
                                        setIsOpen(false);
                                        router.push('/checkout');
                                      } catch (error) {
                                        console.error(error);
                                        toast.error('Không thể đi tới thanh toán lúc này.');
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-200 my-1 mx-1 transition-colors"
                                  >
                                    <CreditCard size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://save-voucher')) {
                                const match = href.match(/voucherId=([^&]+)/);
                                const voucherId = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (voucherId) {
                                        saveVoucher.mutate(Number(voucherId));
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 my-1 mx-1 transition-colors"
                                  >
                                    <Ticket size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('action://track-order')) {
                                const match = href.match(/orderCode=([^&]+)/);
                                const orderCode = match ? match[1] : null;
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setIsOpen(false);
                                      if (orderCode) {
                                        router.push(`/dashboard/don-hang/${orderCode}`);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 my-1 mx-1 transition-colors"
                                  >
                                    <Package size={14} />
                                    {children}
                                  </button>
                                );
                              }
                              if (href?.startsWith('/')) {
                                let Icon = null;
                                if (href.includes('don-hang')) Icon = Package;
                                else if (href.includes('vouchers')) Icon = Ticket;
                                else if (href.includes('san-pham-yeu-thich')) Icon = Heart;
                                else if (href.includes('chat')) Icon = MessageSquare;
                                else if (href.includes('thong-bao')) Icon = Bell;
                                else if (href.includes('dashboard')) Icon = User;

                                return (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setIsOpen(false);
                                      router.push(href);
                                    }}
                                    className={`inline-flex items-center gap-1 text-emerald-600 underline hover:text-emerald-700 font-medium ${Icon ? 'no-underline bg-emerald-50 px-2 py-1 rounded-md text-xs border border-emerald-100 my-1 transition-colors hover:bg-emerald-100' : ''}`}
                                  >
                                    {Icon && <Icon size={14} className="text-emerald-600" />}
                                    {children}
                                  </button>
                                );
                              }
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                                  {...props}
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {msg.role === 'user' && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhắn tin cho OCOP Assistant..."
              className="max-h-[120px] min-h-[44px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              rows={1}
              disabled={isLoading}
            />
            {isLoading ? (
              <div
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
                title="Đang phản hồi..."
              >
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
              >
                <Send size={18} />
              </button>
            )}
          </form>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">
              AI có thể đưa ra câu trả lời không chính xác. Hãy kiểm tra lại thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => {
          if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để trò chuyện với OCOP Support');
            return;
          }
          setIsOpen(!isOpen);
        }}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <Image
          src="/images/chatbot.png"
          alt="Logo"
          width={80}
          height={80}
          className="absolute w-[120%] h-[120%] max-w-none object-contain"
        />
        {/* Pulse effect */}
        <span className="absolute -z-10 h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"></span>
      </button>
    </div>
  );
};
