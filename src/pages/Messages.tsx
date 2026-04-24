import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Message, Conversation, UserProfile } from '../types';
import { Send, MessageSquare, ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn, formatTimeAgo } from '../lib/utils';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const withUserId = searchParams.get('with');

  const [conversations, setConversations] = useState<(Conversation & { otherUser?: UserProfile })[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleStartNewConversation = useCallback(async (otherId: string) => {
    // Check if other user exists
    const userDoc = await getDoc(doc(db, 'users', otherId));
    if (!userDoc.exists()) return;
    setOtherUser(userDoc.data() as UserProfile);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Conversations
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
      
      const convsWithDetails = await Promise.all(convs.map(async (conv) => {
        const otherId = conv.participants.find(p => p !== user.uid);
        if (otherId) {
          const userDoc = await getDoc(doc(db, 'users', otherId));
          return { ...conv, otherUser: userDoc.data() as UserProfile };
        }
        return { ...conv, otherUser: undefined };
      }));

      setConversations(convsWithDetails as (Conversation & { otherUser?: UserProfile })[]);
      setLoading(false);

      // If 'with' is in URL, try to find or create conversation
      if (withUserId && !selectedConv) {
        const existing = convsWithDetails.find(c => c.participants.includes(withUserId));
        if (existing) {
          setSelectedConv(existing.id);
          setOtherUser(existing.otherUser || null);
        } else {
          // New conversation (optimistic)
          handleStartNewConversation(withUserId);
        }
      }
    });

    return () => unsubscribe();
  }, [user, withUserId, selectedConv, handleStartNewConversation]);

  // Fetch Messages for selected conversation
  useEffect(() => {
    if (!selectedConv) {
      return;
    }

    const q = query(
      collection(db, 'conversations', selectedConv, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    return () => unsubscribe();
  }, [selectedConv]);

  // Clear messages when no conversation is selected
  useEffect(() => {
    if (!selectedConv) {
      setTimeout(() => setMessages([]), 0);
    }
  }, [selectedConv]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || (!selectedConv && !withUserId)) return;

    let convId = selectedConv;

    try {
      // Create conversation if it doesn't exist
      if (!convId && withUserId) {
        const newConv = await addDoc(collection(db, 'conversations'), {
          participants: [user.uid, withUserId],
          updatedAt: serverTimestamp(),
          lastMessage: newMessage,
          lastMessageAt: serverTimestamp()
        });
        convId = newConv.id;
        setSelectedConv(convId);
      }

      if (convId) {
        await addDoc(collection(db, 'conversations', convId, 'messages'), {
          senderId: user.uid,
          receiverId: selectedConv ? conversations.find(c => c.id === selectedConv)?.participants.find(p => p !== user.uid) : withUserId,
          text: newMessage,
          createdAt: serverTimestamp()
        });

        // Update conversation metadata
        await updateDoc(doc(db, 'conversations', convId), {
          lastMessage: newMessage,
          lastMessageAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading conversations...</div>;

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] flex bg-white rounded-[3rem] border border-black/5 overflow-hidden artistic-shadow">
      {/* Sidebar - Conversation List */}
      <div className={cn(
        "w-full md:w-96 border-r border-black/5 flex flex-col bg-brand-bg",
        selectedConv ? "hidden md:flex" : "flex"
      )}>
        <div className="p-10 border-b border-black/5">
          <h2 className="text-3xl font-serif font-black tracking-tighter uppercase italic">Inbox<span className="text-black/10">.</span></h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && !withUserId ? (
            <div className="p-16 text-center space-y-6">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto border border-black/5">
                <MessageSquare className="text-black/10 w-8 h-8" />
              </div>
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Silent Corridor</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConv(conv.id);
                    setOtherUser(conv.otherUser || null);
                  }}
                  className={cn(
                    "w-full p-10 flex items-center gap-6 transition-all text-left group",
                    selectedConv === conv.id ? "bg-white" : "hover:bg-white/50"
                  )}
                >
                  <div className="w-16 h-16 rounded-3xl bg-zinc-100 overflow-hidden border border-black/5 transition-all group-hover:scale-105 group-hover:artistic-shadow grayscale group-hover:grayscale-0">
                    {conv.otherUser?.photoURL ? (
                      <img src={conv.otherUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-2xl italic text-black/20">
                        {conv.otherUser?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-serif italic text-xl text-black truncate">
                        {conv.otherUser?.displayName || 'Anonymous'}
                      </h3>
                    </div>
                    <p className="text-[11px] text-black/40 truncate font-medium tracking-wide uppercase">{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#FAF9F6] relative",
        !selectedConv && !withUserId ? "hidden md:flex items-center justify-center text-center p-12" : "flex"
      )}>
        {!selectedConv && !withUserId ? (
          <div className="space-y-10">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border border-black/5 relative">
              <div className="absolute inset-0 bg-black/5 rounded-[3rem] -rotate-6" />
              <MessageSquare className="text-black/10 w-12 h-12 relative z-10" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic">Select a Dialogue</h3>
              <p className="text-black/30 text-sm max-w-xs mx-auto font-medium leading-relaxed">Initiate a conversation with artisans or clients to manifest your projects into reality.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-10 py-8 bg-white border-b border-black/5 flex items-center gap-6">
              <button 
                onClick={() => setSelectedConv(null)}
                className="md:hidden p-3 text-black/40 hover:text-black border border-black/5 rounded-2xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 overflow-hidden border border-black/5 grayscale">
                {otherUser?.photoURL ? (
                  <img src={otherUser.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-xl italic text-black/20">
                    {otherUser?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif italic text-black">{otherUser?.displayName || 'Dialogue'}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                  <span className="text-[9px] font-bold text-black/30 uppercase tracking-[0.3em]">Encrypted Channel</span>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 scroll-smooth">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.uid;
                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      isMine ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "px-8 py-5 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-sm transition-all",
                      isMine 
                        ? "bg-brand-ink text-white rounded-br-none artistic-shadow" 
                        : "bg-white text-black border border-black/5 rounded-bl-none"
                    )}>
                      {msg.text}
                    </div>
                    {msg.createdAt && (
                      <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest mt-3 px-2">
                        {formatTimeAgo(msg.createdAt.toDate())}
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-10 bg-white border-t border-black/5">
              <form onSubmit={sendMessage} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Draft your response..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-8 py-5 bg-brand-bg border border-black/5 rounded-2xl focus:outline-none focus:border-black/20 transition-all font-serif italic text-lg shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-8 bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-20 shadow-2xl active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Messages;
