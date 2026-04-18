import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js'; // ✅ FIXED

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAIN_EMOJIS = ["😈", "😏", "🤑", "🔥", "❤️", "🤭"];

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ جلب بيانات المستخدم من Farcaster
  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
     const context = await sdk.context;
const user = context.user;
      if (user?.username) {
        setMyUsername(user.username);
      }
    };
    init();
  }, []);

  // ✅ جلب الرسائل الخاصة بي
  const fetchMessages = async () => {
    if (!myUsername) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('target_username', myUsername)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [myUsername]);

  // ✅ إرسال رسالة
  const handleSend = async (emoji: string) => {
    if (!username) {
      alert("Enter username");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('messages').insert([
      {
        target_username: username,
        emoji: emoji,
        revealed: false,
        sender_name: myUsername // 👈 مهم للكشف لاحقاً
      }
    ]);

    setLoading(false);

    if (!error) {
      alert("Sent successfully!");
      setUsername('');
    } else {
      alert("Error sending");
    }
  };

  // ✅ كشف الهوية (نسخة MVP بدون دفع)
  const handleReveal = async (id: number) => {
    const { error } = await supabase
      .from('messages')
      .update({ revealed: true })
      .eq('id', id);

    if (!error) {
      fetchMessages();
    }
  };

  return (
    <div style={{ padding: 20, color: "#fff", background: "#000", minHeight: "100vh" }}>
      
      <h2>STEALTH PROTOCOL 🛡️</h2>

      {/* إرسال */}
      <input
        placeholder="@username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {MAIN_EMOJIS.map((e) => (
          <motion.button
            key={e}
            onClick={() => handleSend(e)}
            style={{ padding: 15, fontSize: 24 }}
          >
            {e}
          </motion.button>
        ))}
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* الاستقبال */}
      <h3>Incoming Messages</h3>

      {messages.length === 0 && <p>No messages yet</p>}

      {messages.map((msg) => (
        <div key={msg.id} style={{ marginBottom: 15, padding: 10, border: "1px solid #333" }}>
          <div style={{ fontSize: 30 }}>{msg.emoji}</div>

          {msg.revealed ? (
            <p>From: @{msg.sender_name}</p>
          ) : (
            <>
              <p>Someone sent this 👀</p>
              <button onClick={() => handleReveal(msg.id)}>
                Reveal 🔓
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;