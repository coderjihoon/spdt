import type { Metadata } from "next";

const cta = "/#diagnosis-form";

export const metadata: Metadata = {
  title: "SPDT | Product pages built for the buying decision",
  description: "We diagnose the structure, copy, and proof on your product page so customers can understand what matters and take the next step.",
  openGraph: { url: "/story2", title: "SPDT | Product pages built for the buying decision" },
};

const friction = [
  ["The offer arrives too late", "A visitor should know what you sell before they need to scroll."],
  ["Features crowd out the benefit", "More information does not help if the reason to buy stays unclear."],
  ["Proof misses the moment", "Reviews and credentials work best beside the question they answer."],
];

const steps = [
  ["Send the page", "Share a product URL or screenshots of your current page."],
  ["Find the friction", "We review the first screen, message order, proof, and path to action."],
  ["Choose the first fixes", "Get three priority issues and a direction for improving them."],
];

export default function StoryTwoPage() {
  return (
    <main lang="en" className="overflow-x-clip bg-[#F6F7F4] text-[#15232A]">
      <header className="border-b border-[#CCD4D5] px-5 sm:px-8">
        <div className="mx-auto flex h-20 max-w-[1360px] items-center justify-between gap-5">
          <a href="/" className="text-xl font-bold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">SPDT<span className="text-[#004EE0]">.</span></a>
          <nav aria-label="Page sections" className="hidden gap-8 text-sm font-medium md:flex"><a href="#friction" className="hover:text-[#004EE0]">The problem</a><a href="#method" className="hover:text-[#004EE0]">Our approach</a><a href="#steps" className="hover:text-[#004EE0]">How it works</a></nav>
          <a href={cta} className="inline-flex min-h-11 items-center border-b-2 border-[#004EE0] text-sm font-semibold text-[#004EE0] hover:text-[#003CB3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">Get a free review <span aria-hidden="true" className="ml-3">↗</span></a>
        </div>
      </header>

      <section className="px-5 pb-0 pt-20 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_250px] lg:items-start">
            <h1 className="max-w-[1100px] text-[clamp(2.75rem,8vw,8.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] [text-wrap:balance]">A product page<br />should make the<br /><span className="text-[#004EE0]">decision easier.</span></h1>
            <div className="border-t-2 border-[#15232A] pt-5 lg:mt-4">
              <p className="text-base leading-7 text-[#465963]">Structure, copy, and proof arranged around the questions a customer asks before buying.</p>
              <a href={cta} className="mt-7 inline-flex min-h-12 items-center rounded-md bg-[#004EE0] px-5 text-sm font-semibold text-white hover:bg-[#003CB3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">Review my page <span aria-hidden="true" className="ml-4">↗</span></a>
            </div>
          </div>
          <div className="mt-20 grid border-y border-[#15232A] md:grid-cols-3">
            {[["01", "What is this?"], ["02", "Why should I care?"], ["03", "What do I do next?"]].map(([number, text]) => <div key={number} className="flex min-h-24 items-center gap-6 border-b border-[#CCD4D5] py-4 md:min-h-32 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"><span className="text-xs font-bold tabular-nums text-[#004EE0]">{number}</span><span className="text-xl font-semibold tracking-[-0.025em]">{text}</span></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1360px]"><div className="grid gap-12 lg:grid-cols-[0.45fr_0.55fr] lg:gap-24"><p className="max-w-sm text-lg leading-8 text-[#465963]">The strongest pages do not ask customers to work out the story for themselves.</p><h2 className="text-[clamp(2.8rem,5.7vw,6.2rem)] font-semibold leading-[1.1] tracking-[-0.04em] [text-wrap:balance]">Clear offer.<br />Visible value.<br />A next step.</h2></div><div className="mt-20 h-2 bg-[#15232A]"><div className="h-2 w-1/3 bg-[#004EE0]" /></div><div className="mt-4 flex justify-between text-xs font-semibold text-[#465963]"><span>UNDERSTAND</span><span>TRUST</span><span>ACT</span></div></div>
      </section>

      <section id="friction" className="bg-[#15232A] px-5 py-24 text-white sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1360px]"><div className="flex flex-col justify-between gap-10 md:flex-row md:items-end"><h2 className="max-w-4xl text-[clamp(3rem,6.8vw,7rem)] font-semibold leading-[1.07] tracking-[-0.04em]">Where interest<br />turns into doubt.</h2><p className="max-w-xs text-lg leading-8 text-[#BAC9D0]">A good product can lose a customer when the page answers the wrong question first.</p></div><div className="mt-16 border-t border-white/40">{friction.map(([title, body], index) => <div key={title} className="grid gap-4 border-b border-white/25 py-8 lg:grid-cols-[80px_1fr_0.7fr] lg:items-start lg:gap-10 lg:py-10"><span className="text-sm font-semibold tabular-nums text-[#A9C1FF]">0{index + 1}</span><h3 className="text-[clamp(1.8rem,3.6vw,3.8rem)] font-medium leading-tight tracking-[-0.035em]">{title}</h3><p className="max-w-md text-base leading-8 text-[#BAC9D0]">{body}</p></div>)}</div></div>
      </section>

      <section id="method" className="bg-[#E5ECED] px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1360px]"><div className="grid gap-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-24"><div><h2 className="text-[clamp(2.6rem,4.8vw,5rem)] font-semibold leading-[1.13] tracking-[-0.04em]">We read it<br />as a customer would.</h2><p className="mt-8 max-w-md text-lg leading-8 text-[#465963]">We look at the opening message, the order of information, and where evidence needs to appear. Then we identify what to change first.</p><a href="/#report-preview" className="mt-8 inline-block border-b border-[#15232A] pb-1 text-sm font-semibold hover:text-[#004EE0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">See a sample review ↗</a></div><div className="border-t-2 border-[#15232A] pt-8"><p className="text-[clamp(2rem,3.3vw,3.7rem)] leading-[1.27] tracking-[-0.035em]">“They did more than make the page I asked for. They thought through the planning with me and built a page that communicates and persuades. It was a true collaboration.”</p><p className="mt-8 text-sm text-[#465963]">Client review, translated from Korean · repeat customer</p></div></div></div>
      </section>

      <section id="steps" className="px-5 py-24 sm:px-8 sm:py-36"><div className="mx-auto max-w-[1360px]"><h2 className="text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[1.07] tracking-[-0.04em]">Start with the page<br />you have today.</h2><ol className="mt-16 grid gap-8 md:grid-cols-3">{steps.map(([title, body], index) => <li key={title} className="border-t-2 border-[#15232A] pt-6"><span className="text-[clamp(4rem,6vw,6.5rem)] font-semibold leading-none tracking-[-0.04em] text-[#AEBBC0]">0{index + 1}</span><h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-4 max-w-sm text-base leading-7 text-[#465963]">{body}</p></li>)}</ol></div></section>

      <section className="bg-[#004EE0] px-5 py-24 text-white sm:px-8 sm:py-32"><div className="mx-auto max-w-[1360px]"><h2 className="max-w-6xl text-[clamp(3rem,7vw,7.5rem)] font-semibold leading-[1.06] tracking-[-0.04em]">Find the first thing<br />to fix.</h2><div className="mt-12 flex flex-col gap-8 border-t border-white/40 pt-8 md:flex-row md:items-end md:justify-between"><p className="max-w-xl text-lg leading-8 text-[#D6E4FF]">Send a URL or screenshots. We will outline three issues that may be getting in the way of a purchase.</p><a href={cta} className="inline-flex min-h-14 items-center self-start rounded-md bg-white px-7 text-base font-semibold text-[#003CA9] hover:bg-[#EAF1FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a free page review <span aria-hidden="true" className="ml-6 text-xl">↗</span></a></div></div></section>

      <footer className="bg-[#15232A] px-5 py-9 text-white sm:px-8"><div className="mx-auto flex max-w-[1360px] flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between"><span className="text-lg font-bold tracking-[-0.03em]">SPDT.</span><span className="text-[#B3C1C7]">Product pages built around the buying decision.</span><a href="/" className="underline underline-offset-4 hover:text-[#AFC6FF]">Back to the main site</a></div></footer>
    </main>
  );
}
