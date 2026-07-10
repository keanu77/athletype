import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { typeProfiles } from "@/data/types";
import { MBTIType } from "@/features/mbti/types";

// Phase 2b: Static generation for all 16 types
export function generateStaticParams() {
  const types: MBTIType[] = [
    "ISTJ",
    "ISFJ",
    "INFJ",
    "INTJ",
    "ISTP",
    "ISFP",
    "INFP",
    "INTP",
    "ESTP",
    "ESFP",
    "ENFP",
    "ENTP",
    "ESTJ",
    "ESFJ",
    "ENFJ",
    "ENTJ",
  ];
  return types.map((type) => ({ type: type.toLowerCase() }));
}

// Phase 2b: Dynamic metadata per type
export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type: typeParam } = await params;
  const mbtiType = typeParam.toUpperCase() as MBTIType;
  const profile = typeProfiles[mbtiType];

  if (!profile) {
    return { title: "找不到類型 | 運動人格測驗" };
  }

  const title = `${profile.type} ${profile.displayName.zh} | 運動人格測驗`;
  const description = `${profile.tagline.zh}。了解 ${profile.type} 的運動優勢、訓練建議、教練溝通方式與適合運動。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function TypeDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: typeParam } = await params;
  const mbtiType = typeParam.toUpperCase() as MBTIType;
  const profile = typeProfiles[mbtiType];

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">找不到此人格類型</p>
        <Link href="/types">
          <Button>返回類型列表</Button>
        </Link>
      </div>
    );
  }

  // Phase 2d: JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${profile.type} ${profile.displayName.zh} — 運動人格類型`,
    description: profile.tagline.zh,
    author: { "@type": "Person", name: "吳易澄醫師" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/types"
            className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block"
          >
            ← 返回類型列表
          </Link>
          <h1 className="text-6xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {profile.type}
            </span>
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            {profile.displayName.zh}
          </p>
          <p className="text-lg text-gray-500 mt-2">{profile.tagline.zh}</p>
        </div>

        {/* Content Sections */}
        <SectionCard title="優勢特質" items={profile.strengths} icon="💪" />
        <SectionCard title="需注意的盲點" items={profile.pitfalls} icon="⚠️" />
        <SectionCard title="適合的運動" items={profile.sportFit} icon="🏃" />
        <SectionCard title="訓練建議" items={profile.trainingTips} icon="📋" />
        <SectionCard title="教練溝通建議" items={profile.coachTips} icon="🎯" />
        <SectionCard
          title="潛在風險行為"
          items={profile.riskBehaviors}
          icon="🚨"
        />

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            想知道你是否是 {profile.type} 嗎？
          </p>
          <Link href="/">
            <Button size="lg">開始測驗</Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
          <p>本測驗結果僅供參考，不代表專業心理評估或醫療診斷</p>
          <p className="mt-1">如有任何疑慮，請諮詢專業人士</p>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  return (
    <Card variant="elevated" className="mb-4">
      <CardContent className="py-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <span className="text-blue-500 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
