const questions = [
  { phase:"Fase 1 — Orçamento", text:"Você ganha R$2.000/mês. Seguindo a regra 50/30/20, quanto deve ir para poupança?", opts:["R$ 200","R$ 400","R$ 600","R$ 1.000"], correct:1, tip:"A regra 50/30/20 indica que 20% deve ser poupado. 20% de R$2.000 = R$400." },
  { phase:"Fase 1 — Orçamento", text:"Maria ganha R$3.000 e gasta R$3.400 por mês. O que isso representa?", opts:["Endividamento","Poupança negativa","Equilíbrio","Consumo consciente"], correct:0, tip:"Gastar mais do que ganha gera dívidas progressivas. Ela precisa cortar gastos urgente." },
  { phase:"Fase 1 — Orçamento", text:"Qual é a melhor definição de 'necessidade' em finanças?", opts:["Roupa de grife","Streaming","Conta de água e luz","Jantar no restaurante"], correct:2, tip:"Necessidades são gastos essenciais: moradia, alimentação, saúde e serviços básicos." },
  { phase:"Fase 2 — Poupança e Juros", text:"Carlos investiu R$1.000 a 10% a.a. com juros compostos. Após 2 anos, quanto ele terá?", opts:["R$ 1.200","R$ 1.210","R$ 1.100","R$ 1.020"], correct:1, tip:"Juros compostos: 1.000×1,1=1.100 (1º ano); 1.100×1,1=1.210 (2º ano). Juros sobre juros!" },
  { phase:"Fase 2 — Poupança e Juros", text:"Para que serve um fundo de emergência?", opts:["Investir na bolsa","Cobrir imprevistos sem se endividar","Pagar férias","Comprar luxos"], correct:1, tip:"O fundo cobre situações inesperadas (demissão, saúde) sem precisar do cartão de crédito." },
  { phase:"Fase 2 — Poupança e Juros", text:"João tem R$500 para investir. Qual opção tem MAIOR liquidez?", opts:["Imóvel","Ações de longo prazo","Tesouro Selic","CDB com 2 anos de carência"], correct:2, tip:"O Tesouro Selic permite resgatar qualquer dia útil sem perda de rentabilidade." },
  { phase:"Fase 3 — Decisões", text:"Ana quer comprar um celular de R$3.000 no cartão em 12x sem juros. O que fazer primeiro?", opts:["Comprar imediatamente","Verificar se cabe no orçamento","Pegar empréstimo","Parcelar ao máximo"], correct:1, tip:"Antes de parcelar, veja se R$250/mês não compromete mais de 30% da sua renda." },
  { phase:"Fase 3 — Decisões", text:"O que são os juros do cartão de crédito rotativo?", opts:["Desconto na fatura","Um dos juros mais altos do Brasil","Taxa de anuidade","Benefício do cartão"], correct:1, tip:"O rotativo pode passar de 300% ao ano! Sempre pague o valor total da fatura." },
  { phase:"Fase 3 — Decisões", text:"Pedro quer ter R$10.000 em 1 ano. Quanto precisa guardar por mês?", opts:["R$ 500","R$ 834","R$ 1.000","R$ 1.200"], correct:1, tip:"R$10.000 ÷ 12 meses ≈ R$834. Definir metas ajuda a planejar quanto e quando guardar." },
  { phase:"Fase 3 — Decisões", text:"Qual atitude representa consumo consciente?", opts:["Comprar por impulso na promoção","Pesquisar e comparar antes de comprar","Usar cheque especial para lazer","Parcelar tudo no cartão"], correct:1, tip:"Consumo consciente = pesquisar, comparar e avaliar se o gasto é realmente necessário." },
];

let current = 0, score = 0, coins = 0, results = [];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame() {
  current = 0; score = 0; coins = 0; results = [];
  buildStreakBar();
  showScreen('s-game');
  renderQuestion();
}

function buildStreakBar() {
  const bar = document.getElementById('streak-bar');
  bar.innerHTML = '';
  questions.forEach(() => {
    const d = document.createElement('div');
    d.className = 'streak-dot';
    bar.appendChild(d);
  });
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('q-phase').textContent = q.phase;
  document.getElementById('q-num').textContent = `Pergunta ${current+1} de ${questions.length}`;
  document.getElementById('progress').style.width = `${(current / questions.length) * 100}%`;
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('coin-count').textContent = coins;
  const fb = document.getElementById('feedback');
  fb.className = 'feedback-box'; fb.textContent = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('next-btn').textContent = current === questions.length - 1 ? 'Ver Resultado →' : 'Próxima →';

  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  const letters = ['A','B','C','D'];
  q.opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${o}</span>`;
    b.onclick = () => answer(i, b);
    opts.appendChild(b);
  });
}

function answer(idx, el) {
  const q = questions[current];
  document.querySelectorAll('.opt').forEach(b => b.classList.add('disabled'));
  const fb = document.getElementById('feedback');
  const dots = document.querySelectorAll('.streak-dot');

  if (idx === q.correct) {
    el.classList.add('correct');
    score++; coins += 10;
    results.push(true);
    dots[current].classList.add('done');
    fb.className = 'feedback-box ok';
    fb.innerHTML = `<strong>✓ Correto!</strong> ${q.tip}`;
    spawnCoins(el);
  } else {
    el.classList.add('wrong');
    document.querySelectorAll('.opt')[q.correct].classList.add('correct');
    results.push(false);
    dots[current].classList.add('wrong');
    fb.className = 'feedback-box nok';
    fb.innerHTML = `<strong>✗ Incorreto.</strong> ${q.tip}`;
  }

  document.getElementById('coin-count').textContent = coins;
  document.getElementById('next-btn').style.display = 'inline-block';
}

function spawnCoins(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'coin-burst';
      span.textContent = '+10';
      span.style.left = (rect.left + rect.width/2 + (Math.random()-0.5)*60) + 'px';
      span.style.top  = (rect.top  + rect.height/2) + 'px';
      span.style.color = '#F5C842';
      span.style.fontFamily = "'Syne', sans-serif";
      span.style.fontWeight = '800';
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 1000);
    }, i * 100);
  }
}

function nextQuestion() {
  current++;
  if (current >= questions.length) { showResult(); return; }
  renderQuestion();
}

function showResult() {
  showScreen('s-end');
  document.getElementById('progress').style.width = '100%';
  document.getElementById('final-score').textContent = `${score}/10`;
  document.getElementById('final-coins').textContent = coins;

  let icon, title, msg, badgeClass, badgeText;
  if (score >= 9) {
    icon='🏆'; title='Mestre das Finanças!';
    msg='Você domina educação financeira. Continue investindo no seu conhecimento!';
    badgeClass='lb-expert'; badgeText='Nível: Expert';
  } else if (score >= 7) {
    icon='⭐'; title='Muito Bem!';
    msg='Ótimo resultado! Revise os pontos que errou e você será um expert em breve.';
    badgeClass='lb-adv'; badgeText='Nível: Avançado';
  } else if (score >= 5) {
    icon='📈'; title='Bom Começo!';
    msg='Você está no caminho certo. Estude mais sobre juros compostos e investimentos.';
    badgeClass='lb-mid'; badgeText='Nível: Intermediário';
  } else {
    icon='📚'; title='Continue Aprendendo!';
    msg='Não desanime! Leia os conceitos com atenção e tente novamente.';
    badgeClass='lb-init'; badgeText='Nível: Iniciante';
  }

  document.getElementById('end-icon').textContent = icon;
  document.getElementById('end-title').textContent = title;
  document.getElementById('end-msg').textContent = msg;
  document.getElementById('result-badge').innerHTML = `<span class="level-badge ${badgeClass}">${badgeText}</span>`;
}

/* ── particles ── */
function createParticles() {
  const c = document.getElementById('particles');
  const colors = ['#F5C842','#2ECC8A','#a78bfa','#60a5fa'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${8 + Math.random()*12}s;
      animation-delay:${Math.random()*10}s;
    `;
    c.appendChild(p);
  }
}
createParticles();