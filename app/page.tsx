"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import portfolio from "@/data/portfolio.json";
import { withBasePath } from "@/lib/asset-path";

const SECTION_IDS = ["home", ...portfolio.navigation.map(({ target }) => target)];

function ProfileSection() {
  const [imageReady, setImageReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { profile } = portfolio;

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setImageReady(true);
  }, [profile.image.src]);

  return (
    <section className="page-section profile-section" id="profile" aria-label="PROFILE">
      <div className="profile-scroll-area">
        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-image-frame">
              <span className="profile-image-placeholder" aria-hidden={imageReady}>이미지 공간</span>
              <img
                alt={profile.image.alt}
                className={imageReady ? "profile-image is-ready" : "profile-image"}
                onError={() => setImageReady(false)}
                onLoad={() => setImageReady(true)}
                ref={imageRef}
                src={withBasePath(profile.image.src)}
              />
            </div>

            <div className="profile-name">
              <strong>{profile.nameKo}</strong>
              <span>{profile.nameEn}</span>
            </div>

            <dl className="profile-contacts">
              {profile.contacts.map(({ label, value, href }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <a href={href} rel={label === "GitHub" ? "noreferrer" : undefined} target={label === "GitHub" ? "_blank" : undefined}>
                      {value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="profile-description">
            <h2>{profile.headline}</h2>
            <ul>
              {profile.introductions.map((introduction) => (
                <li key={introduction}>{introduction}</li>
              ))}
            </ul>
            <div className="profile-tags" aria-label="기술 분야">
              {profile.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type AchievementItem = { date: string; title: string; subtitle: string };

function AchievementItemList({ items }: { items: AchievementItem[] }) {
  return (
    <ul className="achievement-items">
      {items.map(({ date, title, subtitle }) => (
        <li key={`${date}-${title}`}>
          <time>{date}</time>
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AchievementsSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollArea = sectionRef.current?.querySelector<HTMLElement>(".achievement-content-scroll");
    if (!scrollArea) return;

    const keepWheelInsideContent = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      scrollArea.scrollTop += event.deltaY;
    };

    scrollArea.addEventListener("wheel", keepWheelInsideContent, { passive: false });
    return () => scrollArea.removeEventListener("wheel", keepWheelInsideContent);
  }, [openId]);

  return (
    <section className="page-section achievements-section" id="achievements" aria-label="ACHIEVEMENTS" ref={sectionRef}>
      <div className="achievements-scroll-area">
        <div className="achievements-list">
          {portfolio.achievements.map(({ groups, id, label, items }) => {
            const isOpen = openId === id;
            const contentId = `achievement-${id}`;

            return (
              <article className="achievement-group" data-open={isOpen} key={id}>
                <h2>
                  <button
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    className="achievement-toggle"
                    onClick={() => setOpenId((current) => (current === id ? null : id))}
                    type="button"
                  >
                    <span>{label}</span>
                    <span className="accordion-arrow" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </button>
                </h2>

                {isOpen && (
                  <div className="achievement-reveal" id={contentId}>
                    <div className="achievement-reveal-inner">
                      <div className="achievement-content-scroll">
                        {groups.length > 0 ? (
                          <div className="achievement-subgroups">
                            {groups.map((group) => {
                              const groupLabel = "label" in group ? String(group.label) : null;

                              return (
                              <section className="achievement-subgroup" key={group.id}>
                                {groupLabel ? <h3>{groupLabel}</h3> : null}
                                {group.items.length > 0 ? (
                                  <AchievementItemList items={group.items} />
                                ) : (
                                  <p className="achievement-empty">내용을 추가해 주세요.</p>
                                )}
                              </section>
                              );
                            })}
                          </div>
                        ) : items.length > 0 ? (
                          <AchievementItemList items={items} />
                        ) : (
                          <p className="achievement-empty">내용을 추가해 주세요.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.1a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10.59 13.41a2 2 0 0 0 2.82 0l3.18-3.18a2 2 0 1 0-2.82-2.82l-1.41 1.41-1.42-1.41 1.42-1.41a4 4 0 1 1 5.66 5.66l-3.18 3.18a4 4 0 0 1-5.66 0l-.7-.71 1.41-1.42.7.7Zm2.82-2.82a2 2 0 0 0-2.82 0l-3.18 3.18a2 2 0 1 0 2.82 2.82l1.41-1.41 1.42 1.41-1.42 1.41a4 4 0 1 1-5.66-5.66l3.18-3.18a4 4 0 0 1 5.66 0l.7.71-1.41 1.42-.7-.7Z" />
    </svg>
  );
}

function ProjectLogo({ alt, fallback, src }: { alt: string; fallback: string; src: string }) {
  const [imageReady, setImageReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setImageReady(true);
  }, [src]);

  return (
    <div className="project-logo">
      <span aria-hidden={imageReady}>{fallback}</span>
      <img
        alt={alt}
        className={imageReady ? "is-ready" : ""}
        onError={() => setImageReady(false)}
        onLoad={() => setImageReady(true)}
        ref={imageRef}
        src={withBasePath(src)}
      />
    </div>
  );
}

type ProjectDetail = { title: string; contents: string[] };
type ProjectDetailImage = { src: string; alt: string };
type OtherProject = {
  title: string;
  meta: string;
  githubLinks: Array<{ label: string; href: string }>;
  urls: Array<{ label: string; href: string }>;
  contents: string[];
};

function ProjectsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const archiveModalCloseRef = useRef<HTMLButtonElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const archiveIndex = portfolio.projects.length;
  const totalItems = portfolio.projects.length + 2;
  const selectedProjectIndex = portfolio.projects.findIndex(({ id }) => id === selectedProjectId);
  const selectedProject = selectedProjectIndex >= 0 ? portfolio.projects[selectedProjectIndex] : null;
  const selectedProjectDetails = (selectedProject?.details ?? []) as ProjectDetail[];
  const selectedProjectImages = (selectedProject?.images ?? []) as ProjectDetailImage[];
  const archiveItems = portfolio.projectArchive.items as OtherProject[];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxProjectIndex = portfolio.projects.length + 1;
    let animationFrame = 0;
    const updateFocusedProject = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const firstItem = scroller.querySelector<HTMLElement>(".project-snap-item");
        if (!firstItem) return;

        const nextIndex = Math.min(
          Math.max(Math.round(scroller.scrollTop / firstItem.offsetHeight), 0),
          maxProjectIndex,
        );
        setFocusedIndex(nextIndex);
      });
    };

    scroller.addEventListener("scroll", updateFocusedProject, { passive: true });
    updateFocusedProject();

    return () => {
      cancelAnimationFrame(animationFrame);
      scroller.removeEventListener("scroll", updateFocusedProject);
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProjectId(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    modalCloseRef.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedProject]);

  useEffect(() => {
    if (!isArchiveOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsArchiveOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    archiveModalCloseRef.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isArchiveOpen]);

  return (
    <section className="page-section projects-section" id="projects" aria-label="PROJECTS">
      <div className="projects-scroll-area" ref={scrollerRef}>
        {portfolio.projects.map((project, index) => {
          const distance = Math.min(Math.abs(focusedIndex - index), 3);

          return (
            <article
              className="project-snap-item"
              data-distance={distance}
              data-focused={focusedIndex === index}
              data-index={index}
              key={project.id}
            >
              <div className="project-card">
                <button
                  aria-label={`${project.title} 상세 보기`}
                  className="project-card-open"
                  onClick={() => setSelectedProjectId(project.id)}
                  type="button"
                />
                <div className="project-heading">
                  <ProjectLogo alt={project.logo.alt} fallback={project.title.slice(0, 1)} src={project.logo.src} />
                  <div>
                    <h2>{project.title}</h2>
                    <p>{project.period}</p>
                  </div>
                </div>

                <div className="project-copy">
                  <p>{project.topic}</p>
                  <p>{project.description}</p>
                </div>

                <ul className="project-keywords" aria-label={`${project.title} 키워드`}>
                  {project.keywords.slice(0, 4).map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>

                <div className="project-links">
                  {project.githubLinks.map(({ href, label }) => (
                    <a aria-label={`${project.title} ${label}`} href={href} key={`${label}-${href}`} onClick={(event) => event.stopPropagation()} rel="noreferrer" target="_blank">
                      <GithubIcon />
                      <span>{label}</span>
                    </a>
                  ))}
                  {project.urls.map(({ href, label }) => (
                    <a aria-label={`${project.title} ${label}`} href={href} key={`${label}-${href}`} onClick={(event) => event.stopPropagation()} rel="noreferrer" target="_blank">
                      <LinkIcon />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}

        <article
          className="project-snap-item"
          data-distance={Math.min(Math.abs(focusedIndex - archiveIndex), 3)}
          data-focused={focusedIndex === archiveIndex}
          data-index={archiveIndex}
        >
          <div className="project-archive-card">
            <button
              aria-label="기타 프로젝트 종합 보기"
              className="project-card-open"
              onClick={() => setIsArchiveOpen(true)}
              type="button"
            />
            <p className="project-archive-eyebrow">{portfolio.projectArchive.eyebrow}</p>
            <h2>{portfolio.projectArchive.title}</h2>
            <p className="project-archive-description">{portfolio.projectArchive.description}</p>
            <ul className="project-archive-title-list">
              {archiveItems.slice(0, 4).map(({ title }) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </div>
        </article>

        <article
          className="project-snap-item"
          data-distance={Math.min(Math.abs(focusedIndex - (totalItems - 1)), 3)}
          data-focused={focusedIndex === totalItems - 1}
          data-index={totalItems - 1}
        >
          <a className="more-projects-card" href={portfolio.moreProjects.href} rel="noreferrer" target="_blank">
            <span className="more-projects-mark">+</span>
            <h2>{portfolio.moreProjects.title}</h2>
            <p>{portfolio.moreProjects.description}</p>
            <strong>
              {portfolio.moreProjects.label}
              <span aria-hidden="true">↗</span>
            </strong>
          </a>
        </article>
      </div>

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProjectId(null);
          }}
        >
          <article
            aria-labelledby="project-modal-title"
            aria-modal="true"
            className="project-modal"
            data-project-index={selectedProjectIndex}
            role="dialog"
          >
            <button
              aria-label="프로젝트 상세 닫기"
              className="project-modal-close"
              onClick={() => setSelectedProjectId(null)}
              ref={modalCloseRef}
              type="button"
            >
              ×
            </button>

            <header className="project-modal-header">
              <ProjectLogo
                alt={selectedProject.logo.alt}
                fallback={selectedProject.title.slice(0, 1)}
                src={selectedProject.logo.src}
              />
              <div>
                <div className="project-modal-title-line">
                  <h2 id="project-modal-title">{selectedProject.title}</h2>
                  <span>{selectedProject.status}</span>
                </div>
                <p>
                  {selectedProject.topic} | {selectedProject.description} | {selectedProject.period}
                </p>
              </div>
            </header>

            <div className="project-modal-links">
              {selectedProject.githubLinks.map(({ href, label }) => (
                <a href={href} key={`${label}-${href}`} rel="noreferrer" target="_blank">
                  <GithubIcon />
                  <span>{label}</span>
                </a>
              ))}
              {selectedProject.urls.map(({ href, label }) => (
                <a href={href} key={`${label}-${href}`} rel="noreferrer" target="_blank">
                  <LinkIcon />
                  <span>{label}</span>
                </a>
              ))}
            </div>

            {selectedProjectDetails.length > 0 && (
              <div className="project-modal-details">
                {selectedProjectDetails.map(({ contents, title }) => (
                  <section key={title}>
                    <h3>{title}</h3>
                    <ul>
                      {contents.map((content) => (
                        <li key={content}>{content}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            <ul className="project-modal-keywords" aria-label={`${selectedProject.title} 전체 키워드`}>
              {selectedProject.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>

            {selectedProjectImages.length > 0 && (
              <div className="project-modal-images">
                {selectedProjectImages.map(({ alt, src }) => (
                  <img alt={alt} key={src} src={withBasePath(src)} />
                ))}
              </div>
            )}
          </article>
        </div>
      )}

      {isArchiveOpen && (
        <div
          className="project-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsArchiveOpen(false);
          }}
        >
          <article
            aria-labelledby="archive-modal-title"
            aria-modal="true"
            className="project-modal archive-detail-modal"
            role="dialog"
          >
            <button
              aria-label="기타 프로젝트 상세 닫기"
              className="project-modal-close"
              onClick={() => setIsArchiveOpen(false)}
              ref={archiveModalCloseRef}
              type="button"
            >
              ×
            </button>

            <header className="archive-detail-header">
              <p>{portfolio.projectArchive.eyebrow}</p>
              <h2 id="archive-modal-title">{portfolio.projectArchive.title}</h2>
              <span>{portfolio.projectArchive.description}</span>
            </header>

            <div className="archive-detail-list">
              {archiveItems.map(({ contents, githubLinks, meta, title, urls }) => (
                <section className="archive-detail-item" key={title}>
                  <h3>{title}</h3>
                  <p>{meta}</p>

                  {(githubLinks.length > 0 || urls.length > 0) && (
                    <div className="archive-detail-links">
                      {githubLinks.map(({ href, label }) => (
                        <a href={href} key={`${label}-${href}`} rel="noreferrer" target="_blank">
                          <GithubIcon />
                          <span>{label}</span>
                        </a>
                      ))}
                      {urls.map(({ href, label }) => (
                        <a href={href} key={`${label}-${href}`} rel="noreferrer" target="_blank">
                          <LinkIcon />
                          <span>{label}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <ul>
                    {contents.map((content) => (
                      <li key={content}>{content}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const scrollRootRef = useRef<HTMLElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionCooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionLockRef = useRef(false);
  const activeSectionRef = useRef("home");
  const [activeSection, setActiveSection] = useState("home");
  const [isLeavingHome, setIsLeavingHome] = useState(false);

  const moveToSection = useCallback((sectionId: string, animateDot = false) => {
    const destination = document.getElementById(sectionId);
    if (!destination) return;

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (transitionCooldownRef.current) clearTimeout(transitionCooldownRef.current);

    if (animateDot && sectionId === "profile") {
      transitionLockRef.current = true;
      setIsLeavingHome(true);
      transitionTimerRef.current = setTimeout(() => {
        destination.scrollIntoView({ behavior: "auto", block: "start" });
        setIsLeavingHome(false);
        transitionCooldownRef.current = setTimeout(() => {
          transitionLockRef.current = false;
        }, 250);
      }, 700);
      return;
    }

    destination.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          activeSectionRef.current = visible.target.id;
          setActiveSection(visible.target.id);
        }
      },
      { root, threshold: [0.55, 0.75, 0.95] },
    );

    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const handleWheel = (event: WheelEvent) => {
      if (transitionLockRef.current) {
        event.preventDefault();
        return;
      }

      if (activeSectionRef.current === "home" && event.deltaY > 0) {
        event.preventDefault();
        moveToSection("profile", true);
      }
    };

    let touchStartY: number | null = null;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (
        transitionLockRef.current ||
        (activeSectionRef.current === "home" && touchStartY !== null && currentY !== undefined && currentY < touchStartY)
      ) {
        event.preventDefault();
      }
    };
    const handleTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY;
      const shouldLeaveHome =
        touchStartY !== null &&
        endY !== undefined &&
        touchStartY - endY > 36 &&
        activeSectionRef.current === "home" &&
        !transitionLockRef.current;

      touchStartY = null;
      if (shouldLeaveHome) moveToSection("profile", true);
    };

    root.addEventListener("wheel", handleWheel, { passive: false });
    root.addEventListener("touchstart", handleTouchStart, { passive: true });
    root.addEventListener("touchmove", handleTouchMove, { passive: false });
    root.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("wheel", handleWheel);
      root.removeEventListener("touchstart", handleTouchStart);
      root.removeEventListener("touchmove", handleTouchMove);
      root.removeEventListener("touchend", handleTouchEnd);
    };
  }, [moveToSection]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (transitionCooldownRef.current) clearTimeout(transitionCooldownRef.current);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav aria-label="Portfolio sections">
          <ul className="navigation-list">
            {portfolio.navigation.map(({ label, target }) => (
              <li key={target}>
                <button
                  className="navigation-link"
                  data-active={activeSection === target}
                  onClick={() => moveToSection(target, activeSection === "home" && target === "profile")}
                  type="button"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main
        className="scroll-root"
        ref={scrollRootRef}
      >
        <section className="page-section hero-section" id="home" aria-label="Portfolio intro">
          <div className="hero-content">
            <h1>{portfolio.title}</h1>
            <div className="motion-line" aria-hidden="true">
              <span className={`motion-dot${isLeavingHome ? " is-moving" : ""}`} />
            </div>
            <p>{portfolio.owner}</p>
          </div>
        </section>

        <ProfileSection />
        <AchievementsSection />
        <ProjectsSection />
      </main>
    </>
  );
}
