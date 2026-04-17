import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { motion } from 'framer-motion';

// إعدادات الثوابت
const WALLET = "0x51D0b8CA143E23889b7F41a6f35B47857a9E43F6";
const TOKEN_SYMBOL = "🖕"; 
const MAIN_EMOJIS = ["😈", "😏", "🤑", "🔥", "❤️", "🤭"];
const THEME_BLUE = "#00d4ff";
const ACTIVE_PURPLE = "#6200ee";

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [incomingEmoji, setIncomingEmoji] = useState({ char: "😏", type: "NORMAL" });

  useEffect(() => {
    const init = async () => { await sdk.actions.ready(); };
    init();
  }, []);

  const tapAnimation = {
    scale: 1.1,
    backgroundColor: ACTIVE_PURPLE,
    transition: { duration: 0.1 }
  };

  // دالة المشاركة الجديدة
  const handleShare = () => {
    const text = `Someone sent me an anonymous "${incomingEmoji.char}" on Stealth Protocol! 🕵️‍♂️✨\n\nWho was it? Send me one or check your own:`;
    // استبدل الرابط أدناه برابط الـ Frame الخاص بك لاحقاً
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    sdk.actions.openUrl(shareUrl);
  };

  const handleAction = async (type: 'MAIN' | 'PREMIUM' | 'RANDOM' | 'DIAMOND', emoji?: string) => {
    if (!username) { alert("Please enter @username first"); return; }

    let revealPrice = "0.25$";
    let actionDescription = "";

    switch (type) {
      case 'MAIN':
        revealPrice = "0.25$";
        actionDescription = `Sent ${emoji} to @${username}. Free for you!`;
        break;
      case 'PREMIUM':
        revealPrice = "1$";
        actionDescription = `Stealth ${TOKEN_SYMBOL} sent! This requires $${TOKEN_SYMBOL} holdings.`;
        break;
      case 'RANDOM':
        revealPrice = "1$";
        actionDescription = `Random Chaos sent to @${username}!`;
        break;
      case 'DIAMOND':
        alert(`💖 This will cost you $100 to send.\nTarget @${username} will get a special alert.`);
        return;
    }

    console.log(`Saving to DB: From Me to ${username}, Price to reveal: ${revealPrice}`);
    alert(`✅ ${actionDescription}\n\nThey must pay ${revealPrice} to see your name.`);
  };

  return (
    <div style={styles.mobileContainer}>
      <div style={styles.appScreen}>
        
        <div style={styles.header}>
          <h2 style={styles.logo}>STEALTH PROTOCOL 🛡️</h2>
          <p style={styles.tagline}>Send anonymous emojis. They pay, you stay hidden.</p>
        </div>

        <input 
          placeholder="Recipient @username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={styles.mobileInput}
        />

        <div style={styles.section}>
          <p style={styles.sectionTitle}>FREE SENDS (0.25$ to reveal)</p>
          <div style={styles.emojiGrid}>
            {MAIN_EMOJIS.map(e => (
              <motion.button 
                key={e} 
                onClick={() => handleAction("MAIN", e)} 
                style={styles.emojiBtn}
                whileTap={tapAnimation}
              >
                {e}
              </motion.button>
            ))}
          </div>
        </div>

        <div style={styles.actionGrid}>
          <motion.button 
            onClick={() => handleAction("RANDOM")} 
            style={styles.actionCard}
            whileTap={tapAnimation}
          >
            <span style={{fontSize: '20px'}}>🎲</span>
            <span>Random</span>
            <span style={styles.priceTag}>FREE</span>
          </motion.button>
          <motion.button 
            onClick={() => handleAction("PREMIUM")} 
            style={styles.actionCard}
            whileTap={tapAnimation}
          >
            <span style={{fontSize: '20px'}}>{TOKEN_SYMBOL}</span>
            <span>Send ${TOKEN_SYMBOL}</span>
            <span style={styles.priceTag}>HOLDERS</span>
          </motion.button>
        </div>

        <motion.button 
          onClick={() => handleAction("DIAMOND")} 
          style={styles.diamondMobileBtn}
          whileTap={{...tapAnimation, background: ACTIVE_PURPLE}}
        >
          💎 Diamond Love Confession ($100)
        </motion.button>

        <div style={styles.receivedContainer}>
          <p style={styles.sectionTitle}>INCOMING STEALTH MESSAGES</p>
          
          <div style={styles.receivedBox}>
            <div style={styles.bigEmoji}>{incomingEmoji.char}</div>
            <p style={{fontSize: '11px', color: '#888'}}>
              Someone is messing with you! 
              <br/>
              Pay {incomingEmoji.type === "NORMAL" ? "0.25$" : "1$"} to reveal their identity.
            </p>
            
            {/* أزرار الأكشن: كشف ومشاركة */}
            <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
              <motion.button 
                onClick={() => alert(`Redirecting to payment...`)} 
                style={{...styles.mobileUnlockBtn, flex: 2, marginTop: 0}}
                whileTap={{ scale: 1.05, backgroundColor: "#ddd" }}
              >
                UNLOCK 🔓
              </motion.button>
              <motion.button 
                onClick={handleShare} 
                style={{...styles.mobileUnlockBtn, flex: 1, marginTop: 0, background: 'transparent', border: `1px solid ${THEME_BLUE}`, color: THEME_BLUE}}
                whileTap={{ scale: 1.05, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
              >
                SHARE 🔗
              </motion.button>
            </div>
          </div>

          <div style={{...styles.receivedBox, marginTop: '15px', borderColor: ACTIVE_PURPLE, background: 'rgba(98, 0, 238, 0.05)'}}>
            <p style={{fontSize: '11px', color: ACTIVE_PURPLE, fontWeight: 'bold', marginBottom: '10px'}}>💎 HAVE A SECRET DIAMOND CODE?</p>
            <input 
              placeholder="Enter KISS-XXXX Code" 
              value={secretCodeInput} 
              onChange={(e) => setSecretCodeInput(e.target.value)} 
              style={{...styles.mobileInput, marginBottom: '10px', padding: '12px', fontSize: '14px', textAlign: 'center'}}
            />
            <motion.button 
              onClick={() => alert(`Checking code: ${secretCodeInput}`)} 
              style={{...styles.mobileUnlockBtn, background: ACTIVE_PURPLE, color: '#fff'}}
              whileTap={tapAnimation}
            >
              DECRYPT CONFESSION 💖
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  mobileContainer: { background: '#050505', minHeight: '100vh', display: 'flex', justifyContent: 'center' },
  appScreen: { width: '100%', maxWidth: '400px', padding: '15px', display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  header: { textAlign: 'center' as const },
  logo: { color: THEME_BLUE, fontSize: '1.4rem', fontWeight: 'bold' as const, margin: 0, letterSpacing: '1px' },
  tagline: { fontSize: '10px', color: '#666', marginTop: '5px' },
  mobileInput: { width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '16px', boxSizing: 'border-box' as const },
  section: { width: '100%' },
  sectionTitle: { fontSize: '11px', color: THEME_BLUE, fontWeight: 'bold' as const, marginBottom: '10px', textTransform: 'uppercase' as const },
  emojiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  emojiBtn: { padding: '15px', fontSize: '26px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', cursor: 'pointer', color: '#fff' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  actionCard: { padding: '15px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '5px', color: '#fff', cursor: 'pointer' },
  priceTag: { color: THEME_BLUE, fontSize: '10px', fontWeight: 'bold' as const },
  diamondMobileBtn: { width: '100%', padding: '18px', background: `linear-gradient(45deg, #004e92, ${THEME_BLUE})`, border: 'none', borderRadius: '16px', color: '#fff', fontWeight: 'bold' as const, cursor: 'pointer' },
  receivedContainer: { marginTop: '10px', paddingBottom: '30px' },
  receivedBox: { background: '#0a0a0a', padding: '20px', borderRadius: '20px', border: '1px solid #1a1a1a', textAlign: 'center' as const },
  bigEmoji: { fontSize: '50px', marginBottom: '10px', filter: `drop-shadow(0 0 10px rgba(0,212,255,0.3))` },
  mobileUnlockBtn: { width: '100%', marginTop: '15px', padding: '14px', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold' as const, border: 'none', cursor: 'pointer' }
};

export default App;