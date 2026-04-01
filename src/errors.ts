// ── Custom Error Classes ──

export class PersonaNotFoundError extends Error {
  public readonly personaName: string;

  constructor(personaName: string) {
    super(`Persona "${personaName}" not found. Run \`persona-injector list\` to see available personas.`);
    this.name = 'PersonaNotFoundError';
    this.personaName = personaName;
  }
}

export class PersonaLoadError extends Error {
  public readonly personaName: string;
  public readonly section: string;

  constructor(personaName: string, section: string, cause?: Error) {
    super(`Failed to load section "${section}" for persona "${personaName}": ${cause?.message ?? 'unknown error'}`);
    this.name = 'PersonaLoadError';
    this.personaName = personaName;
    this.section = section;
    if (cause) this.cause = cause;
  }
}

export class InjectionError extends Error {
  public readonly filePath: string;

  constructor(filePath: string, cause?: Error) {
    super(`Failed to inject into "${filePath}": ${cause?.message ?? 'unknown error'}`);
    this.name = 'InjectionError';
    this.filePath = filePath;
    if (cause) this.cause = cause;
  }
}

export class CleanupError extends Error {
  public readonly filePath: string;

  constructor(filePath: string, cause?: Error) {
    super(`Failed to clean up "${filePath}": ${cause?.message ?? 'unknown error'}`);
    this.name = 'CleanupError';
    this.filePath = filePath;
    if (cause) this.cause = cause;
  }
}
