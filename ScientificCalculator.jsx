import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState([]);

  const buttonLayout = [
    ['RAD', 'DEG', 'Clear', 'AC'],
    ['sin', 'cos', 'tan', 'ln', 'log', '1/x'],
    ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'e^x', '10^x', 'x^y'],
    ['√', '∛', 'x!', 'x²', 'x³', '%'],
    ['π', 'e', '(', ')'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', ' '],
    ['÷', '×', '-', '+'],
    ['=']
  ];

  const factorial = (n) => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const safeEvaluate = (expression) => {
    const calculation = expression
      .replace(/sin⁻¹\s*(\d+\.?\d*)/g, 'Math.asin($1)')
      .replace(/cos⁻¹\s*(\d+\.?\d*)/g, 'Math.acos($1)')
      .replace(/tan⁻¹\s*(\d+\.?\d*)/g, 'Math.atan($1)')
      .replace(/sin\s*(\d+\.?\d*)/g, `Math.sin(${angleMode === 'DEG' ? 'Math.PI / 180 * ' : ''}$1)`)
      .replace(/cos\s*(\d+\.?\d*)/g, `Math.cos(${angleMode === 'DEG' ? 'Math.PI / 180 * ' : ''}$1)`)
      .replace(/tan\s*(\d+\.?\d*)/g, `Math.tan(${angleMode === 'DEG' ? 'Math.PI / 180 * ' : ''}$1)`)
      .replace(/ln\s*(\d+\.?\d*)/g, 'Math.log($1)')
      .replace(/log\s*(\d+\.?\d*)/g, 'Math.log10($1)')
      .replace(/e\^(\d+\.?\d*)/g, 'Math.exp($1)')
      .replace(/10\^(\d+\.?\d*)/g, '10 ** $1')
      .replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, 'Math.pow($1, $2)')
      .replace(/√\s*(\d+\.?\d*)/g, 'Math.sqrt($1)')
      .replace(/∛\s*(\d+\.?\d*)/g, 'Math.cbrt($1)')
      .replace(/(\d+\.?\d*)!/g, 'factorial($1)')
      .replace(/(\d+\.?\d*)²/g, 'Math.pow($1, 2)')
      .replace(/(\d+\.?\d*)³/g, 'Math.pow($1, 3)')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    try {
      return new Function('Math', 'factorial', `return ${calculation}`)(Math, factorial);
    } catch (error) {
      console.error('Calculation error:', error);
      return 'Error';
    }
  };

  const handleButtonClick = (button) => {
    switch(button) {
      case 'RAD':
      case 'DEG':
        setAngleMode(button);
        break;

      case 'Clear':
      case 'AC':
        setDisplay('0');
        if (button === 'AC') {
          setHistory([]);
        }
        break;

      case '=':
        try {
          const result = safeEvaluate(display);
          if (result === 'Error') {
            setDisplay('Error');
          } else {
            const formattedResult = Number(parseFloat(result).toFixed(8));
            setHistory(prev => [...prev, `${display} = ${formattedResult}`]);
            setDisplay(String(formattedResult));
          }
        } catch (error) {
          setDisplay('Error');
          console.error('Calculation error:', error);
        }
        break;

      default:
        if (['sin', 'cos', 'tan', 'ln', 'log', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'].includes(button)) {
          setDisplay(prev => prev === '0' ? button : `${prev}${button}`);
        } else if (['√', '∛'].includes(button)) {
          setDisplay(prev => prev === '0' ? button : `${prev}${button}`);
        } else if (button === '1/x') {
          setDisplay('1/x');
        } else if (button === 'x!') {
          setDisplay(prev => `${prev}!`);
        } else if (button === 'x²') {
          setDisplay(prev => `${prev}²`);
        } else if (button === 'x³') {
          setDisplay(prev => `${prev}³`);
        } else if (button === '%') {
          setDisplay(prev => `${prev}/100`);
        } else if (button === 'e^x') {
          setDisplay(prev => prev === '0' ? 'e^' : `${prev}e^`);
        } else if (button === '10^x') {
          setDisplay(prev => prev === '0' ? '10^' : `${prev}10^`);
        } else if (button === 'x^y') {
          setDisplay(prev => `${prev}^`);
        } else if ('0123456789.'.includes(button)) {
          setDisplay(prev => {
            if (prev === '0' && button !== '.') {
              return button;
            }
            if (prev === '1/x') {
              return '1/' + button;
            }
            return prev + button;
          });
        } else if (['+', '-', '×', '÷', '(', ')', 'π', 'e'].includes(button)) {
          setDisplay(prev => {
            if (prev === '1/x') {
              return '1/' + button;
            }
            const lastChar = prev[prev.length - 1];
            if (['+', '-', '×', '÷'].includes(lastChar) && ['+', '-', '×', '÷'].includes(button)) {
              return prev.slice(0, -1) + button;
            }
            return prev === '0' ? button : prev + button;
          });
        }
    }
  };

  const getButtonStyle = (button) => {
    let baseStyle = "px-3 py-1.5 rounded-lg m-0.5 text-sm transition-colors duration-150 ";
    
    if ('0123456789.'.includes(button)) {
      return baseStyle + "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200";
    }
    else if (['+', '-', '×', '÷'].includes(button)) {
      return baseStyle + "bg-gray-200 text-gray-800 hover:bg-gray-300";
    }
    else if (['sin', 'cos', 'tan', 'ln', 'log', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'e^x', '10^x', 'x^y', '1/x', '√', '∛', 'x!', 'x²', 'x³', '%'].includes(button)) {
      return baseStyle + "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
    else if (['π', 'e', '(', ')'].includes(button)) {
      return baseStyle + "bg-purple-100 text-purple-800 hover:bg-purple-200";
    }
    else if (['RAD', 'DEG'].includes(button)) {
      return baseStyle + "bg-gray-700 text-white hover:bg-gray-800" + (angleMode === button ? " ring-1 ring-blue-500" : "");
    }
    else if (['Clear', 'AC'].includes(button)) {
      return baseStyle + "bg-red-100 text-red-800 hover:bg-red-200";
    }
    else if (button === '=') {
      return baseStyle + "bg-blue-500 text-white hover:bg-blue-600 w-full";
    }
    else {
      return baseStyle + "bg-gray-700 text-white hover:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-6">
      <header className="w-full bg-gray-800 text-white py-3 px-4 text-center mb-3 rounded-t-xl">
        <h1 className="text-xl font-semibold">Scientific Calculator</h1>
        <p className="text-gray-400 text-sm mt-0.5">Mathematical Calculations</p>
      </header>

      <div className="flex gap-4 justify-center">
        <div className="bg-white rounded-xl shadow-xl p-4 w-[600px]">
          <div className="bg-gray-800 text-white rounded-xl p-3 mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">{angleMode}</span>
              <span className="text-sm text-gray-400">
                {history[history.length - 1] || ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-semibold">{display}</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {buttonLayout.map((row, rowIndex) => (
              <div key={rowIndex} className={`col-span-${row.length === 3 ? '3' : '6'} grid grid-cols-${row.length}`}>
                {row.map((button) => (
                  <button
                    key={button}
                    onClick={() => handleButtonClick(button)}
                    className={getButtonStyle(button)}
                  >
                    {button}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
