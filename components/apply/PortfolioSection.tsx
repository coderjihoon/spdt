import Image from "next/image";
import Link from "next/link";

const projects = [
  { slug: "zeus", name: "ZEUS", title: "코골이 관리 웨어러블", description: "복잡한 작동 원리를 직관적으로 풀어낸 상세페이지." },
  { slug: "deopocket", name: "데오포켓", title: "가정용 탈취제 리뉴얼", description: "탈취 성능과 감성적인 생활 장면을 함께 담았습니다." },
  { slug: "myodam", name: "묘담", title: "키튼 건강스틱", description: "성장기 고양이의 영양 설계를 보호자의 언어로 전합니다." },
  { slug: "sonkei", name: "소네키", title: "26FW 주얼리 컬렉션", description: "주얼리에 담긴 소망과 의미를 하나의 이야기로 연결했습니다." },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="overflow-hidden bg-[#111] py-20 lg:py-[140px]">
      <div className="mx-auto mb-10 max-w-[1280px] px-4 sm:px-6 lg:mb-14 lg:px-10">
        <p className="text-[14px] font-medium tracking-[0.18em] text-slate-400">PORTFOLIO</p>
        <h2 id="portfolio-title" className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[44px] lg:text-[52px]">제품의 장점을, 고객의 구매 이유로.</h2>
        <p className="mt-5 max-w-[620px] text-[15px] leading-7 text-slate-300">제품마다 다른 문제를 살펴보고, 정보의 순서와 문장을 다듬은 작업을 모았습니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.slug} className="min-w-0">
            <Link href={`/works/${project.slug}`} aria-label={`${project.name} ${project.title} 작업물 보기`} className="group relative block aspect-video overflow-hidden bg-[#f1f3f9] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
              <Image src={`/works/${project.slug}/thumbnail-v2.webp`} alt={`${project.name} ${project.title}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end bg-black/50 px-5 py-5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none lg:px-8 lg:py-7 [@media(hover:none)]:opacity-100">
                <h3 className="text-[22px] font-semibold leading-normal tracking-[-0.02em] lg:text-[30px]">{project.name}</h3>
                <p className="mt-1 text-[14px] font-medium lg:text-[16px]">{project.title}</p>
                <p className="mt-2 text-[13px] leading-6 text-white/85 lg:text-[15px]">{project.description}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-10 flex justify-center px-4 lg:mt-14">
        <Link href="/works" className="inline-flex min-h-14 items-center justify-center gap-6 rounded-[12px] border border-white/60 px-8 text-[16px] font-medium text-white transition-colors hover:bg-white hover:text-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none">
          작업물 보러가기
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
        </Link>
      </div>
    </section>
  );
}
