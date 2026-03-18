import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { typeProfiles } from "@/data/types";
import { MBTIType } from "@/features/mbti/types";

export const metadata: Metadata = {
  title: "16 種運動人格類型 | 運動人格測驗",
  description:
    "探索 16 種運動人格類型：分析師、外交官、守衛者、探險家。了解每種類型的運動特質、訓練建議與教練溝通方式。",
  openGraph: {
    title: "16 種運動人格類型 | 運動人格測驗",
    description: "探索 16 種運動人格類型，找到最適合你的運動方式",
  },
};

const typeGroups = {
  "Analysts (分析師)": ["INTJ", "INTP", "ENTJ", "ENTP"] as MBTIType[],
  "Diplomats (外交官)": ["INFJ", "INFP", "ENFJ", "ENFP"] as MBTIType[],
  "Sentinels (守衛者)": ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] as MBTIType[],
  "Explorers (探險家)": ["ISTP", "ISFP", "ESTP", "ESFP"] as MBTIType[],
};

const groupColors: Record<string, string> = {
  "Analysts (分析師)": "from-purple-500 to-indigo-500",
  "Diplomats (外交官)": "from-green-500 to-teal-500",
  "Sentinels (守衛者)": "from-blue-500 to-cyan-500",
  "Explorers (探險家)": "from-orange-500 to-yellow-500",
};

const groupIcons: Record<string, string> = {
  "Analysts (分析師)": "🎯",
  "Diplomats (外交官)": "🤝",
  "Sentinels (守衛者)": "🛡️",
  "Explorers (探險家)": "🏃",
};

export default function TypesPage() {
  return (
    <div className="min-h-screen sports-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="text-sm font-medium text-gray-600">
              探索你的運動人格
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 ribbon">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffc107] bg-clip-text text-transparent">
              16 種運動人格類型
            </span>
          </h1>
          <p className="text-lg text-gray-600">點擊任一類型了解詳細內容</p>
        </div>

        {Object.entries(typeGroups).map(([groupName, types], groupIndex) => (
          <div
            key={groupName}
            className="mb-12 animate-slide-up"
            style={{ animationDelay: `${groupIndex * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{groupIcons[groupName]}</span>
              <h2 className="text-xl font-semibold text-gray-800">
                {groupName}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {types.map((type) => {
                const profile = typeProfiles[type];
                return (
                  <Link key={type} href={`/types/${type.toLowerCase()}`}>
                    <Card
                      variant="elevated"
                      className="h-full hover:scale-105 transition-all cursor-pointer athletic-card sport-stripe"
                    >
                      <CardContent className="py-6 text-center">
                        <div
                          className={`text-3xl font-bold bg-gradient-to-r ${groupColors[groupName]} bg-clip-text text-transparent mb-2`}
                        >
                          {type}
                        </div>
                        <div className="text-lg font-medium text-gray-800 mb-1">
                          {profile.displayName.zh}
                        </div>
                        <div className="text-sm text-gray-500">
                          {profile.tagline.zh}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1e88e5] hover:text-[#1565c0] font-medium transition-colors"
          >
            <span>←</span>
            <span>返回首頁開始測驗</span>
          </Link>
        </div>

        {/* 製作者資訊 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
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
