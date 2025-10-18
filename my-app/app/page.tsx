"use client";

import { useState, useEffect, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import GameMap from './components/GameMap';
import { David_Libre } from 'next/font/google';

const TOTAL_LEVELS = 5;

export default function HomePage() {
  const {
    words,
    story,
    isLoading,
    error,
    timeLeft,
    isRunning,
    currentLevel,
    progress,
    showMap,
    userInput,
    startGame,
    handleSubmit,
    toggleMap,
    handleInputChange: handleInputChangeProp,
    handleFormSubmit,
  } = useGameLogic();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChangeProp(e);
  }, [handleInputChangeProp]);

  const [time, setTime] = useState(new Date());
  const [isDay, setIsDay] = useState(true);

  // Saati güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      // Saat 19:00-07:00 arasında gece temasını göster
      const hour = now.getHours();
      setIsDay(hour >= 7 && hour < 19);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Oyun başlatma ekranı
  if (!isRunning && !story && !showMap) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
        <div className="game-container">
          <h1 className="text-4xl md:text-5xl mb-6 text-center" style={{
            color: 'var(--neon-cyan)',
            textShadow: '0 0 10px var(--neon-cyan)',
            animation: 'flicker 4s infinite alternate',
            letterSpacing: '0.2em',
            fontFamily: 'Orbitron, sans-serif'
          }}>COSMIC ORACLE</h1>
          
          <p className="text-lg mb-8 text-center">3 KELİME SEÇ VE SİBERPUNK BİR HİKAYE OLUŞTUR</p>
          <p className="text-md mb-8 text-center">30 saniye içinde verilen kelimeleri kullanarak bir hikaye yaz.</p>
          
          <div className="flex justify-center">
            <button 
              onClick={startGame}
              className="button primary"
              disabled={isLoading}
              style={{
                padding: '12px 30px',
                fontSize: '1.1rem',
                margin: '0 auto',
                display: 'block'
              }}
            >
              {isLoading ? 'Yükleniyor...' : 'OYUNA BAŞLA'}
            </button>
          </div>
          
          <div className="mt-8 text-sm text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <p>© 2023 Cosmic Oracle - Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    );
  }

  // Harita görünümü
  if (showMap) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
        <div className="game-container">
          <h1 className="text-4xl md:text-5xl mb-6 text-center" style={{
            color: 'var(--neon-cyan)',
            textShadow: '0 0 10px var(--neon-cyan)',
            animation: 'flicker 4s infinite alternate',
            letterSpacing: '0.2em'
          }}>Cosmic Oracle</h1>
          <p className="text-lg mb-8 text-center">Yapay zeka destekli siberpunk hikaye oluşturucuya hoş geldiniz. Başlamak için aşağıdaki butona tıklayın.</p>
          <div className="flex justify-center">
            <button 
              onClick={startGame}
              className="button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Yükleniyor...' : 'OYUNA BAŞLA'}
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 text-center" style={{
              background: 'rgba(255, 0, 0, 0.2)',
              border: '1px solid #ff0000',
              color: '#ff6b6b',
              animation: 'glitch 1s infinite'
            }}>
              {error}
            </div>
          )}
          
          <div className="mt-8 text-sm text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <p> 2023 Cosmic Oracle - Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    );
  }

  // Oyun ekranı veya hikaye sonucu
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
      <div className="game-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl" style={{
            color: 'var(--neon-cyan)',
            textShadow: '0 0 10px var(--neon-cyan)',
            letterSpacing: '0.2em',
            fontFamily: 'Orbitron, sans-serif'
          }}>COSMIC ORACLE</h1>
          <div className="text-xl" style={{
            color: 'var(--neon-pink)',
            textShadow: '0 0 10px var(--neon-pink)',
            fontFamily: 'VT323, monospace'
          }}>
            {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {story ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4" style={{
              color: 'var(--neon-pink)',
              textShadow: '0 0 10px var(--neon-pink)',
              animation: 'flicker 3s infinite alternate',
              fontFamily: 'Orbitron, sans-serif'
            }}>SEVİYE TAMAMLANDI!</h2>
            <div className="p-4 mb-6 text-left border border-cyan-400 rounded bg-black bg-opacity-50" style={{
              minHeight: '200px',
              color: 'var(--neon-cyan)',
              fontFamily: 'Roboto Mono, monospace',
              lineHeight: '1.8',
              boxShadow: '0 0 15px rgba(0, 255, 200, 0.2)'
            }}>
              {story.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <button 
              onClick={startGame}
              className="button primary"
              disabled={isLoading}
              style={{
                padding: '12px 30px',
                fontSize: '1.1rem',
                margin: '0 auto',
                display: 'block'
              }}
            >
              {currentLevel < TOTAL_LEVELS - 1 ? 'SONRAKİ SEVİYE' : 'OYUNU TAMAMLA'}
            </button>
          </div>
        ) : (
            <div className="space-y-6">
              {/* Oyun Bilgileri */}
              <div className="bg-black bg-opacity-50 p-4 rounded border border-cyan-400">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg" style={{ color: 'var(--neon-pink)' }}>
                    SEVİYE: {currentLevel + 1}/{TOTAL_LEVELS}
                  </div>
                  <div className="text-xl" style={{ 
                    color: 'var(--neon-cyan)',
                    fontFamily: 'VT323, monospace',
                    textShadow: '0 0 5px var(--neon-cyan)'
                  }}>
                    {timeLeft} SANİYE
                  </div>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-cyan))',
                      boxShadow: '0 0 10px var(--neon-cyan)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Kelimeler */}
              <div className="flex flex-wrap gap-3 justify-center">
                {words.map((word, index) => (
                  <div 
                    key={index} 
                    className="px-4 py-2 rounded-full border-2 border-cyan-400 text-cyan-300"
                    style={{
                      background: 'rgba(0, 255, 200, 0.1)',
                      textShadow: '0 0 5px var(--neon-cyan)',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              {/* Hikaye Giriş Formu */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <textarea
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded bg-black bg-opacity-50 border border-cyan-400 text-cyan-100"
                  placeholder="Hikayeni yaz..."
                  disabled={!isRunning || isLoading}
                  required
                  rows={8}
                  style={{
                    fontFamily: 'Roboto Mono, monospace',
                    resize: 'vertical',
                    minHeight: '200px',
                    boxShadow: '0 0 10px rgba(0, 255, 200, 0.1)'
                  }}
                />
                
                <div className="flex justify-center gap-4">
                  <button 
                    type="button"
                    onClick={toggleMap}
                    className="button"
                    style={{
                      borderColor: 'var(--neon-pink)',
                      color: 'var(--neon-pink)'
                    }}
                  >
                    HARİTA
                  </button>
                  
                  <button 
                    type="submit" 
                    className="button primary"
                    disabled={!isRunning || isLoading || !userInput.trim()}
                  >
                    {isLoading ? 'GÖNDERİLİYOR...' : 'GÖNDER'}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="p-3 text-center rounded" style={{
                  background: 'rgba(255, 0, 0, 0.2)',
                  border: '1px solid #ff0000',
                  color: '#ff6b6b',
                  animation: 'glitch 1s infinite'
                }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );