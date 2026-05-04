import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { newsletterApi } from '../api/newsletterApi';
import { SubscribeRequest } from '../types/newsletterTypes';

type ApiError = { response?: { data?: { code?: string; message?: string } } };

export const useNewsletter = () => {
  const subscribeMutation = useMutation({
    mutationFn: (data: SubscribeRequest) => newsletterApi.subscribe(data),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
    },
    onError: (error: ApiError) => {
      const errorCode = error?.response?.data?.code;
      if (errorCode === 'NEWSLETTER_ALREADY_SUBSCRIBED') {
        toast.error('Email này đã được đăng ký bản tin.');
      } else {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    },
  });

  const subscribeMeMutation = useMutation({
    mutationFn: () => newsletterApi.subscribeMe(),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
    },
    onError: (error: ApiError) => {
      const errorCode = error?.response?.data?.code;
      if (errorCode === 'NEWSLETTER_ALREADY_SUBSCRIBED') {
        toast.error('Bạn đã đăng ký bản tin này rồi.');
      } else {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    },
  });

  return {
    subscribe: subscribeMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
    subscribeMe: subscribeMeMutation.mutate,
    isSubscribingMe: subscribeMeMutation.isPending,
  };
};

export const useNewsletterConfirm = (token: string | null) => {
  return useQuery({
    queryKey: ['newsletter-confirm', token],
    queryFn: () => newsletterApi.confirm(token!),
    enabled: !!token,
    retry: false,
  });
};

export const useNewsletterUnsubscribe = (token: string | null) => {
  return useQuery({
    queryKey: ['newsletter-unsubscribe', token],
    queryFn: () => newsletterApi.unsubscribe(token!),
    enabled: !!token,
    retry: false,
  });
};

export const useAdminSubscribers = (params: {
  status?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['admin-subscribers', params],
    queryFn: () => newsletterApi.getSubscribers(params),
  });
};

export const useBroadcastMutation = () => {
  return useMutation({
    mutationFn: (data: { subject: string; htmlContent: string }) => newsletterApi.broadcast(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Bản tin đã được gửi thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi bản tin.');
    },
  });
};
