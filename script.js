let machine = null;


document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      machine = JSON.parse(e.target.result);
      console.log("JSON загружен:", machine); 
      displayMachineInfo(); 
      } catch (error) {
    document.getElementById('result').textContent = "Ошибка при загрузке ДКА: " + error.message;
  }
  };
  reader.readAsText(file);
});

function displayMachineInfo() {
  if (machine) {
    let machineInfo = `Загружен ДКА:\nСостояния: ${machine.states.join(", ")}\n`;
    machineInfo += `Алфавит: ${machine.alphabet.join(", ")}\n`;
    machineInfo += `Начальное состояние: ${machine.start}\n`;
    machineInfo += `Конечные состояния: ${machine.end.join(", ")}\n`;
    machineInfo += `\nПереходы:\n`;

    for (let state in machine.func) {
      for (let symbol in machine.func[state]) {
        machineInfo += `δ(${state}, ${symbol}) → ${machine.func[state][symbol]}\n`;
      }
    }

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = machineInfo; 
  }
}




function checkWord() {
  const word = document.getElementById('inputWord').value;
  
  if (!machine) {
    document.getElementById('result').textContent = "ДКА не загружен!";
    return;
  }

  
  if (!word.split('').every(c => machine.alphabet.includes(c))) {
    document.getElementById('result').textContent = "Ошибка: Строка содержит символы, которых нет в алфавите.";
    return;
  }

  let currentState = machine.start;
  let explanation = `(${currentState}, ${word})\n`;

  for (let i = 0; i < word.length; i++) {
    const symbol = word[i];
    explanation += `(δ(${currentState}, ${symbol}), ${word.slice(i + 1) || "λ"})\n`;

    if (machine.func[currentState] && machine.func[currentState][symbol]) {
      currentState = machine.func[currentState][symbol];
    } else {
      document.getElementById('result').textContent = explanation + "Ошибка: Переход для данного состояния отсутствует.";
      return;
    }
  }

  explanation += `Конечное состояние: ${currentState}\n`;
  
  if (machine.end.includes(currentState)) {
    explanation += "Цепочка принимается ДКА.";
  } else {
    explanation += "Ошибка: ДКА остановился в неприемлемом состоянии.";
  }

  document.getElementById('result').textContent = explanation;
}


function createMachine() {
  const states = prompt("Введите состояния через запятую (например, q0,q1,q2):").split(",");
  const alphabet = prompt("Введите символы алфавита через запятую (например, 0,1):").split(",");
  const start = prompt("Введите начальное состояние (например, q0):");
  const end = prompt("Введите конечные состояния через запятую (например, q2):").split(",");
  
  const func = {};
  alert("Теперь введите переходы. Пример: q0,0,q1 (для δ(q0, 0) = q1)");

  states.forEach(state => {
    func[state] = {};
    alphabet.forEach(symbol => {
      const transition = prompt(`Введите переход для δ(${state}, ${symbol}) (или оставьте пустым, если перехода нет):`);
      if (transition) {
        func[state][symbol] = transition;
      }
    });
  });

  machine = { states, alphabet, func, start, end };
  displayMachineInfo();
}