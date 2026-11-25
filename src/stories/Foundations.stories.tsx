import type { Meta, StoryObj } from "@storybook/react-vite";
import { colorTokens, radiusTokens, readToken, spaceTokens, typeTokens } from "../dls/tokenMeta";

function Swatch({ name, variable }: { name: string; variable: string }) {
  const value = readToken(variable);
  return (
    <div className="swatch">
      <div className="swatch-chip" style={{ background: `var(${variable})` }} />
      <div className="swatch-meta">
        <strong>{name}</strong>
        <span>{variable}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

function ColorsView() {
  return (
    <div className="foundation token-grid">
      {colorTokens.map((token) => (
        <Swatch key={token.variable} name={token.name} variable={token.variable} />
      ))}
    </div>
  );
}

function TypeView() {
  return (
    <div className="foundation">
      {typeTokens.map((token) => (
        <TypeRow key={token.variable} name={token.name} variable={token.variable} sample={token.sample} />
      ))}
    </div>
  );
}

function TypeRow({ name, variable, sample }: { name: string; variable: string; sample: string }) {
  const value = readToken(variable);
  return (
    <div className="type-row">
      <span style={{ fontSize: `var(${variable})` }}>{sample}</span>
      <span>
        {name} / {value}
      </span>
    </div>
  );
}

function SpaceView() {
  return (
    <div className="foundation">
      {spaceTokens.map((token) => (
        <SpaceRow key={token.variable} name={token.name} variable={token.variable} />
      ))}
    </div>
  );
}

function SpaceRow({ name, variable }: { name: string; variable: string }) {
  const value = readToken(variable);
  return (
    <div className="space-row">
      <div className="space-bar" style={{ width: `var(${variable})` }} />
      <span>
        {name} / {value}
      </span>
    </div>
  );
}

function RadiusView() {
  return (
    <div className="foundation">
      {radiusTokens.map((token) => (
        <RadiusRow key={token.variable} name={token.name} variable={token.variable} />
      ))}
    </div>
  );
}

function RadiusRow({ name, variable }: { name: string; variable: string }) {
  const value = readToken(variable);
  return (
    <div className="radius-row">
      <div className="radius-box" style={{ borderRadius: `var(${variable})` }} />
      <span>
        {name} / {value}
      </span>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
} satisfies Meta;

export default meta;

export const Colors: StoryObj = { render: () => <ColorsView /> };
export const Typography: StoryObj = { render: () => <TypeView /> };
export const Spacing: StoryObj = { render: () => <SpaceView /> };
export const Radius: StoryObj = { render: () => <RadiusView /> };
