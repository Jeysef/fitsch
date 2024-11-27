import { css, keyframes } from "@emotion/css";
import { type ComponentProps, Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pattern = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

interface ContributorProps extends ComponentProps<"a"> {
  name: string;
}

export function Contributor(props: ContributorProps) {
  const [local, others] = splitProps(props, ["name", "href"]);
  return (
    <Show when={local.href} fallback={<span class={cn(contributorBase)}>{local.name}</span>}>
      <a
        href={local.href}
        target="_blank"
        rel="noopener noreferrer"
        {...others}
        class={cn(contributorBase, contributorStyle, others.class)}
      >
        <span class="at-symbol">@</span>
        <span class="name">{local.name}</span>
      </a>
    </Show>
  );
}

const contributorBase = css`
  display: inline-flex;
  align-items: center;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  transition: all 0.2s ease;
  text-decoration: none;
  gap: 0.125rem;
  
  .at-symbol {
    display: inline-block;
    opacity: 0;
    width: 0;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .name {
    display: inline-block;
  }
`;

const contributorStyle = css`
  position: relative;
  overflow: hidden;
  transform: scale(0.95);

  &:hover {
    transform: scale(1.0);
    background: linear-gradient(
      90deg,
      #3b82f6 0%,
      #8b5cf6 50%,
      #3b82f6 100%
    );
    background-size: 200% auto;
    animation: ${shimmer} 3s linear infinite;
    color: white;
  }

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    animation: ${pattern} 1.5s linear infinite;
    pointer-events: none;
  }

  &:hover .at-symbol {
    opacity: 1;
    width: auto;
    margin-right: 1px;
    animation: ${slideIn} 0.3s ease forwards;
  }

  &:focus-visible {
    outline: none;
    ring: 1.5px solid hsl(var(--ring));
  }
`;
