// hooks/useSendMessage.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

export const useSendMessage = (receiverId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, image }) => {
      const formData = new FormData();
      formData.append("message", text);
      if (image) formData.append("image", image);

      const res = await api.post(`/api/message/send/${receiverId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      //  todo ; query key upfdate
      // ? done 
      // console.log('sent message')
      queryClient.invalidateQueries(["chat-messages", receiverId]);
      queryClient.invalidateQueries(["prev-chats"]);
    },
    onError: (err) => {
      console.error("Send message error:", err);
    },
  });
};
