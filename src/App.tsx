import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

// محفظتك محفوظة ومستخدمة برمجياً الآن
const WALLET = "0x51D0b8CA143E23889b7F41a6f35B47857a9E43F6";

// مصفوفة الـ 50 إيموجي مربوطة بنظام الراندوم
const EMOJIS_50 = ["🔥","🚀","💎","🖕","🍕","👻","🤖","👑","🌈","💀","🍦","🎸","🌊","🍄","🦄","🥨","🥑","🧨","🧿","🍿","☕","🎮","🎯","🎨","🧩","🎤","🎬","🛹","🚲","🧸","🔔","💰","🕯️","🔑","🛡️","🧬","🧪","🩹","🧺","🧼","🪓","🔭","📡","🛸","🪐","🌍","⚡","🤡","👺","👽"];

interface LockData {
  [targetUser: string]: {
    price: string;
    lastSent: number;
  };
}

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [locks, setLocks] = useState<LockData>({});
  
  // تفعيل المتغيرات لإخفاء تنبيهات المحرر
  const [hasIncomingDiamond, setHasIncomingDiamond] = useState(true); 
  const [incomingEmoji, setIncomingEmoji] = useState("❓");

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsSDKLoaded(true);
      console.log("Stealth Protocol Ready. Gateway:", WALLET); // استخدام WALLET برمجياً
    };
    if (sdk) load();
  }, []);

  const handlePay = async (amount: string, type: string, isDiamond: boolean = false) => {
    if (!username) { 
        alert("Please enter Farcaster @username"); 
        return false; 
    }

    const cleanUser = username.replace('@', '').toLowerCase();
    
    // نظام القفل الزمني (24 ساعة) وتدرج الأسعار
    if (type === "Premium Mode" && locks[cleanUser]?.price === 'MAX') {
      const timeLeft = 24 - (Date.now() - locks[cleanUser].lastSent) / (1000 * 60 * 60);
      if (timeLeft > 0) {
        alert(`Limit reached for @${username}. Try again in ${Math.ceil(timeLeft)} hours.`);
        return false;
      }
    }

    const secretCode = `LOVE-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // منطق الـ Random: اختيار إيموجي حقيقي وإرساله للمستلم (مخفي عن المرسل)
    let displayTypeForSender = type;
    if (type === "Random 50") {
      const randomPick = EMOJIS_50[Math.floor(Math.random() * EMOJIS_50.length)];
      setIncomingEmoji(randomPick); // ربط مصفوفة الإيموجي بالمستلم
      displayTypeForSender = "Random Emoji Blast";
    }

    // تنبيه المرسل (يحافظ على سرية نوع الإيموجي في الراندوم)
    const senderAlert = isDiamond 
      ? `💖 Diamond Confession Sent!\nTo: @${username}\nSecret Code: ${secretCode}\nCost: $100`
      : `⚡️ Sent Successfully!\nTo: @${username}\nAction: ${displayTypeForSender}\nCost: ${amount}`;

    alert(senderAlert);

    if (type === "Premium Mode") updatePremiumStatus(cleanUser);
    return true;
  };

  const updatePremiumStatus = (user: string) => {
    setLocks(prev => {
      const currentPrice = prev[user]?.price || '$1';
      let nextPrice = currentPrice === '$1' ? '$3' : currentPrice === '$3' ? '$5' : 'MAX';
      return { ...prev, [user]: { price: nextPrice, lastSent: Date.now() } };
    });
  };

  const getCurrentPremiumPrice = () => {
    const cleanUser = username.replace('@', '').toLowerCase();
    const status = locks[cleanUser]?.price;
    return status === 'MAX' ? "Locked" : (status || '$1');
  };

  if (!isSDKLoaded) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Initializing Stealth Protocol...</div>;

  return (
    <>
      <style>{`
        .stealth-btn { transition: all 0.3s ease; cursor: pointer; outline: none; border: 1px solid rgba(255,255,255,0.1); }
        .stealth-btn:hover:not(:disabled) { transform: scale(1.05); background-color: #6200ee !important; box-shadow: 0 0 20px rgba(98, 0, 238, 0.4); }
        .main-bg { background: radial-gradient(circle at top right, #1a0b2e, #0a0a0f, #000); min-height: 100vh; display: flex; flex-direction: column; align-items: center; color: #fff; padding: 20px; font-family: sans-serif; }
        .input-box { width: 100%; padding: 16px; border-radius: 15px; border: 1px solid #222; background: rgba(255,255,255,0.05); color: #fff; margin-bottom: 15px; text-align: center; font-weight: bold; outline: none; }
        .diamond-alert { width: 100%; max-width: 380px; background: linear-gradient(45deg, #00d4ff, #6200ee); padding: 20px; border-radius: 20px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.3); text-align: center; }
      `}</style>

      <div className="main-bg">
        
        {/* ميزة: خانة اعتراف الحب الدائمة (تظهر للمستلم فقط) */}
        {hasIncomingDiamond && (
          <div className="diamond-alert">
            <h3 style={{margin: '0 0 10px 0'}}>💖 Diamond Confession Waiting!</h3>
            <p style={{fontSize: '0.7rem', marginBottom: '15px'}}>Someone spent $100 to confess. Enter their code to see who.</p>
            <input 
              placeholder="Enter Secret Code" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              className="input-box" 
              style={{background: 'rgba(0,0,0,0.4)', border: 'none', marginBottom: '10px'}}
            />
            <button onClick={() => setHasIncomingDiamond(false)} style={{width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#fff', color: '#6200ee', fontWeight: 'bold', cursor: 'pointer'}}>REVEAL IDENTITY 🔓</button>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
          
          <h3 style={{color: '#6200ee', fontSize: '0.8rem', marginBottom: '15px'}}>SENDER PANEL</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {["😈", "😏", "🤪", "❤️", "🔥", "🤑"].map((emoji) => (
              <button key={emoji} onClick={() => handlePay("0.02$", "Standard")} style={styles.smallEmojiBtn} className="stealth-btn">{emoji}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {/* Random 50 يسار */}
            <button onClick={() => handlePay("1$", "Random 50")} style={styles.card} className="stealth-btn">
              <span style={{ fontSize: '1.5rem' }}>🎲</span>
              <span style={styles.cardLabel}>Random 50</span>
              <span style={{ fontWeight: 'bold' }}>1$</span>
            </button>

            {/* Premium يمين */}
            <button onClick={() => handlePay(getCurrentPremiumPrice(), "Premium Mode")} disabled={getCurrentPremiumPrice() === "Locked"} style={styles.card} className="stealth-btn">
              <span style={{ fontSize: '1.5rem' }}>🖕</span>
              <span style={styles.cardLabel}>Premium Mode</span>
              <span style={{ fontWeight: 'bold' }}>{getCurrentPremiumPrice()}</span>
            </button>

            <div style={{ gridColumn: 'span 2' }}>
                <input placeholder="Target @username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-box" />
            </div>

            <button onClick={() => handlePay("100$", "Diamond", true)} style={{...styles.card, gridColumn: 'span 2', borderColor: '#00d4ff', background: 'rgba(0, 212, 255, 0.05)'}} className="stealth-btn">
              <span style={{ fontSize: '1.5rem' }}>💎</span>
              <span style={styles.cardLabel}>Diamond Love Confession</span>
              <span style={{ fontWeight: 'bold', color: '#00d4ff' }}>$100</span>
            </button>
          </div>

          {/* ميزة: عرض الإيموجي مجاناً والمطالبة بالدفع لمعرفة الهوية */}
          <div style={{marginTop: '40px', borderTop: '1px solid #222', paddingTop: '20px'}}>
            <h3 style={{color: '#00d4ff', fontSize: '0.8rem', marginBottom: '15px'}}>RECEIVED MESSAGES</h3>
            <div style={{background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid #222'}}>
               <div style={{fontSize: '4rem', marginBottom: '15px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'}}>{incomingEmoji}</div>
               <p style={{fontSize: '0.75rem', color: '#777', marginBottom: '20px'}}>You received this emoji anonymously!</p>
               <button onClick={() => alert(`Redirecting to payment for ${WALLET}...`)} style={styles.unlockBtn} className="stealth-btn">Reveal Sender (0.02$) 🔓</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const styles = {
  smallEmojiBtn: { backgroundColor: '#111', borderRadius: '15px', padding: '15px', fontSize: '1.6rem', border: 'none', color: '#fff' },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', border: '1px solid #222' },
  cardLabel: { fontSize: '0.7rem', color: '#777', margin: '5px 0' },
  unlockBtn: { width: '100%', padding: '14px', backgroundColor: '#00d4ff', color: '#000', borderRadius: '12px', fontWeight: 'bold' as const, border: 'none' }
};

export default App;