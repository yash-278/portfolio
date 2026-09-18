import SectionReveal from "@/components/SectionReveal";

const links = [
  { label: "GitHub", handle: "yash-278", href: "https://github.com/yash-278" },
  {
    label: "LinkedIn",
    handle: "kadamyash",
    href: "https://linkedin.com/in/kadamyash",
  },
  {
    label: "X",
    handle: "yashkadam278",
    href: "https://twitter.com/yashkadam278",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-14"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 border-t border-border py-20 md:grid-cols-[7fr_5fr] md:items-end md:py-28">
          <SectionReveal>
            <h2
              id="contact-heading"
              className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text md:text-[3.5rem]"
            >
              Have a project, a role, or a problem you&apos;d like a second
              opinion on?
            </h2>
            <a
              href="mailto:yash@yashkadam.com"
              className="mt-7 inline-block text-xl text-accent underline underline-offset-[6px] transition-colors duration-150 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-2xl"
            >
              yash@yashkadam.com
            </a>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <ul className="border-t border-border">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex justify-between border-b border-border py-3.5 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                    <span className="text-text-muted transition-colors duration-150 group-hover:text-accent">
                      {link.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
