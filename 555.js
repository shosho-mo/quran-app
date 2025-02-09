import { useState, useEffect } from "react";
import { Select, Button, Input, Card } from "@/components/ui";

export default function QuranPlayer() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [repeatCount, setRepeatCount] = useState(1);
  const [audioUrl, setAudioUrl] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => setSurahs(data.data));
  }, []);

  const playAyah = () => {
    fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah}:${ayahNumber}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        setAudioUrl(data.data.audio);
        setPlaying(true);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 p-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">🎵 مشغل القرآن الكريم</h1>
      <Card className="p-6 w-full max-w-lg bg-white shadow-lg rounded-lg">
        <div className="space-y-4">
          <Select className="w-full p-2 border border-gray-300 rounded-lg" onChange={(e) => setSelectedSurah(e.target.value)}>
            {surahs.map((surah) => (
              <option key={surah.number} value={surah.number}>
                {surah.englishName} ({surah.name})
              </option>
            ))}
          </Select>

          <Input
            type="number"
            placeholder="رقم الآية"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={ayahNumber}
            onChange={(e) => setAyahNumber(e.target.value)}
          />

          <Input
            type="number"
            placeholder="عدد التكرارات"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={repeatCount}
            onChange={(e) => setRepeatCount(e.target.value)}
          />

          <Button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" onClick={playAyah}>🔊 تشغيل</Button>

          {audioUrl && (
            <audio
              className="w-full mt-4"
              src={audioUrl}
              controls
              autoPlay
              loop={repeatCount > 1}
              onEnded={() => {
                if (repeatCount > 1) {
                  setRepeatCount(repeatCount - 1);
                  playAyah();
                } else {
                  setPlaying(false);
                }
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
