"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useMBTIStore } from "@/features/mbti/store";
import { useHydration } from "@/hooks/useHydration";

export default function Home() {
  const router = useRouter();
  const hydrated = useHydration();
  const { reset, isCompleted, result } = useMBTIStore();

  const handleStartTest = () => {
    reset();
    router.push("/test");
  };

  const handleViewResult = () => {
    router.push("/result");
  };

  return (
    <div className="min-h-screen sports-bg track-lines">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="text-sm font-medium text-gray-600">
              發現你的運動 DNA
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 ribbon">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffc107] bg-clip-text text-transparent">
              運動人格測驗
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            透過 <span className="font-bold text-[#ff6b35]">28</span>{" "}
            道運動情境題目，發現你的運動人格類型
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            找到最適合你的訓練方式和運動項目
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleStartTest}
              className="btn-sport text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
            >
              開始測驗
            </button>
            {hydrated && isCompleted && result && (
              <Button size="lg" variant="outline" onClick={handleViewResult}>
                查看上次結果 ({result.type})
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>5-10 分鐘</span>
            <span>•</span>
            <span>28 題</span>
            <span>•</span>
            <span>匿名免登入</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <FeatureCard
            title="運動項目建議"
            description="根據你的人格特質，推薦最適合的運動類型"
            color="orange"
            delay={0}
          />
          <FeatureCard
            title="訓練偏好分析"
            description="了解你理想的訓練模式和節奏"
            color="green"
            delay={100}
          />
          <FeatureCard
            title="教練溝通指南"
            description="讓教練更了解如何與你有效溝通"
            color="blue"
            delay={200}
          />
          <FeatureCard
            title="行為風險提醒"
            description="識別可能影響表現的行為模式"
            color="purple"
            delay={300}
          />
        </div>

        {/* About Section */}
        <div className="text-center text-gray-500 text-sm">
          <p>此測驗基於 MBTI 人格理論，模擬運動心理學情境設計</p>
          <p className="mt-2">16 種運動人格類型等你探索</p>
          <p className="mt-4">
            製作者：
            <a
              href="https://line.me/R/ti/p/@521cvffb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1e88e5] hover:text-[#1565c0] font-medium transition-colors"
            >
              運動醫學科吳易澄醫師
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  color,
  delay,
}: {
  title: string;
  description: string;
  color: "orange" | "green" | "blue" | "purple";
  delay: number;
}) {
  const colorClasses = {
    orange:
      "from-[#ff6b35]/10 to-[#ff8c42]/5 border-[#ff6b35]/20 hover:border-[#ff6b35]/40",
    green:
      "from-[#2eb872]/10 to-[#34d399]/5 border-[#2eb872]/20 hover:border-[#2eb872]/40",
    blue: "from-[#1e88e5]/10 to-[#42a5f5]/5 border-[#1e88e5]/20 hover:border-[#1e88e5]/40",
    purple:
      "from-[#7c4dff]/10 to-[#b388ff]/5 border-[#7c4dff]/20 hover:border-[#7c4dff]/40",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
