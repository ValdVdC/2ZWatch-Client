export interface PasswordStrength {
  score: number; // 0-4
  label: string; // 'Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'
  color: string; // Cor do indicador
  percentage: number; // 0-100
  feedback: string[]; // Sugestões de melhoria
}

export class PasswordValidator {
  static validate(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    // Critérios de validação
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasGoodLength = password.length >= 12;
    const hasExcellentLength = password.length >= 14;

    // Cálculo do score
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChars) score++;
    
    // Bônus por comprimento
    if (hasGoodLength) score += 0.5;
    if (hasExcellentLength) score += 0.5;

    // Normalizar score para 0-4
    score = Math.min(4, Math.floor(score * 0.7));

    // Feedback
    if (!hasMinLength) {
      feedback.push('Use no mínimo 8 caracteres');
    }
    if (!hasUpperCase) {
      feedback.push('Adicione letras maiúsculas');
    }
    if (!hasLowerCase) {
      feedback.push('Adicione letras minúsculas');
    }
    if (!hasNumbers) {
      feedback.push('Adicione números');
    }
    if (!hasSpecialChars) {
      feedback.push('Adicione caracteres especiais (!@#$%^&*)');
    }
    if (password.length < 12) {
      feedback.push('Use 12+ caracteres para mais segurança');
    }

    // Definir label e cor baseado no score
    let label = '';
    let color = '';
    let percentage = 0;

    switch (score) {
      case 0:
        label = 'Muito Fraca';
        color = '#ef4444'; // red-500
        percentage = 20;
        break;
      case 1:
        label = 'Fraca';
        color = '#f97316'; // orange-500
        percentage = 40;
        break;
      case 2:
        label = 'Média';
        color = '#eab308'; // yellow-500
        percentage = 60;
        break;
      case 3:
        label = 'Forte';
        color = '#22c55e'; // green-500
        percentage = 80;
        break;
      case 4:
        label = 'Muito Forte';
        color = '#16a34a'; // green-600
        percentage = 100;
        break;
    }

    return {
      score,
      label,
      color,
      percentage,
      feedback: feedback.length > 0 ? feedback : ['Senha segura! ✓']
    };
  }

  // Validação para formulário
  static isPasswordStrong(password: string): boolean {
    const strength = this.validate(password);
    return strength.score >= 2; // Aceita "Média" ou superior
  }

  // Validação estrita
  static isPasswordVeryStrong(password: string): boolean {
    const strength = this.validate(password);
    return strength.score >= 3; // Aceita "Forte" ou superior
  }
}
