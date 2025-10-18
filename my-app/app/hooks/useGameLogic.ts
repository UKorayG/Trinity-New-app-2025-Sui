"use client";

import { useState, useEffect, useCallback } from 'react';

const WORDS = [
  "gelecek", "siber", "robot", "yapay zeka", "veri", "sistem", "hacker", "sibernetik",
  "distopya", "ütopya", "terminal", "bağlantı", "sanal", "gerçeklik", "artırılmış", "sokak",
  "neon", "şehir", "ara sokak", "çatı", "gökdelen", "metro", "drone", "robotik", "makine",
  "sentetik", "klon", "gen", "virüs", "biyoteknoloji", "nano", "organizma", "nabız", "sinyal",
  "fısıltı", "yankı", "iletim", "frekans", "kod", "protokol", "suç", "dedektif", "ödül",
  "avcı", "sendika", "şirket", "korporasyon", "gölge", "hafıza", "rüya", "hayalet", "ruh",
  "zihin", "bilinç", "yükleme", "indirme", "silme", "kaos", "düzen", "isyankar", "direniş",
  "devrim", "kontrol", "özgürlük", "güç", "gerçek", "ışık", "karanlık", "parazit", "sessizlik",
  "yansıma", "geçit", "kapı", "metal", "plastik", "cam", "devre", "kablo", "tel", "çip", "zırh",
  "silah", "aşk", "nefret", "korku", "umut", "hüzün", "neşe", "öfke", "sakin", "fırtına",
  "kentsel", "çürüme", "geçmiş", "şimdi", "bilinmeyen", "sonsuz", "boşluk", "yıldız", "gezegen",
  "galaksi", "evren", "bulutsu", "asteroit", "kuyruklu yıldız", "uydu", "yörünge", "hologram",
  "yanılsama", "serap", "algı", "aldatma", "sır", "yalan", "hikaye", "anlatı", "mit", "efsane",
  "tarih", "kehanet", "kader", "güvenlik duvarı", "şifreleme", "arka kapı", "açık", "yama",
  "hata", "sinirsel", "bağlantı", "sinaps", "işlemci", "çekirdek", "arayüz", "terminal"
];

const TOTAL_LEVELS = 5;
const INITIAL_TIME = 30;

export const useGameLogic = () => {
  const [words, setWords] = useState<string[]>(['', '', '']);
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');

  // Rastgele kelime seç
  const getRandomWords = useCallback(() => {
    const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
    setWords(shuffled.slice(0, 3));
  }, []);

  // Oyunu başlat
  const startGame = useCallback(() => {
    getRandomWords();
    setTimeLeft(INITIAL_TIME - (currentLevel * 3));
    setIsRunning(true);
    setStory('');
    setError('');
    setUserInput('');
  }, [currentLevel, getRandomWords]);

  // Seviyeyi tamamla
  const completeLevel = useCallback(() => {
    const newLevel = currentLevel + 1;
    setCurrentLevel(newLevel);
    setProgress(((newLevel % TOTAL_LEVELS) / TOTAL_LEVELS) * 100);
    setIsRunning(false);
    
    if (newLevel >= TOTAL_LEVELS) {
      // Oyun bitti, sonuçları göster
      setCurrentLevel(0);
      setProgress(0);
    }
  }, [currentLevel]);

  // Geri sayım efekti
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Zaman doldu, hikaye gönder
      handleSubmit();
    }
    
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  // Hikaye gönder
  const handleSubmit = useCallback(async () => {
    if (words.some(word => !word.trim())) {
      setError('Lütfen tüm kelimeleri kullanın.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });

      const data = await response.json();

      if (response.ok) {
        setStory(data.story);
        completeLevel();
      } else {
        setError(data.error || 'Hikaye oluşturulurken bir hata oluştu.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRunning(false);
    }
  }, [words, completeLevel]);

  // Haritayı göster/gizle
  const toggleMap = useCallback(() => {
    setShowMap(!showMap);
  }, [showMap]);

  // Kullanıcı girişini güncelle
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  }, []);

  // Form gönderimini işle
  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  }, [handleSubmit]);

  return {
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
    handleInputChange,
    handleFormSubmit,
  };
};
