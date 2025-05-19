// ==== INICIO ====

document.body.style.cssText = `
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
`;

// Cargar Chart.js desde CDN
const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartScript);

// Cargar Font Awesome desde CDN
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// Esperar a que se cargue Chart.js
chartScript.onload = () => {
  iniciarApp();
};

function iniciarApp() {
  const app = document.createElement('div');
  app.style.cssText = `
    max-width: 600px;
    width: 100%;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  `;

  const header = document.createElement('h2');
  header.innerHTML = '<i class="fa-solid fa-wallet"></i> Gestor de Finanzas Personales';
  header.style.cssText = `text-align: center; color: #333; margin-bottom: 20px;`;

  // Añade en tu header, después del título:
  const darkModeBtn = document.createElement('button');
  darkModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  darkModeBtn.style.cssText = `
    position: absolute; right: 30px; top: 30px; background: none; border: none; font-size: 1.3em; cursor: pointer; color: #333;
  `;
  header.appendChild(darkModeBtn);

  // Botón de exportar CSV
  const exportBtn = document.createElement('button');
  exportBtn.innerHTML = '<i class="fa-solid fa-file-csv"></i> Exportar CSV';
  exportBtn.style.cssText = 'margin-left: 10px; background: #2980b9; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer;';
  header.appendChild(exportBtn);

  // Formulario de perfil
  const perfilBtn = document.createElement('button');
  perfilBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
  perfilBtn.style.cssText = 'margin-left:10px;background:none;border:none;font-size:1.2em;cursor:pointer;';
  header.appendChild(perfilBtn);

  const perfilModal = document.createElement('div');
  perfilModal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);justify-content:center;align-items:center;z-index:10000;';
  perfilModal.innerHTML = `
    <div style="background:#fff;padding:30px;border-radius:12px;min-width:300px;position:relative;">
      <button id="cerrarPerfil" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.2em;">✖</button>
      <h3>Perfil</h3>
      <input id="nombrePerfil" type="text" placeholder="Tu nombre" style="width:100%;padding:8px;margin-bottom:10px;">
      <input id="fotoPerfil" type="file" accept="image/*" style="margin-bottom:10px;">
      <button id="guardarPerfil" style="width:100%;padding:10px;background:#27ae60;color:#fff;border:none;border-radius:8px;">Guardar</button>
    </div>
  `;
  document.body.appendChild(perfilModal);

  perfilBtn.onclick = () => perfilModal.style.display = 'flex';
  perfilModal.querySelector('#cerrarPerfil').onclick = () => perfilModal.style.display = 'none';
  perfilModal.querySelector('#guardarPerfil').onclick = () => {
    localStorage.setItem('nombrePerfil', perfilModal.querySelector('#nombrePerfil').value);
    // Puedes guardar la foto como base64 si quieres
    perfilModal.style.display = 'none';
    actualizarUI();
  };

  const nombre = localStorage.getItem('nombrePerfil');
  if (nombre) header.innerHTML += `<div style="font-size:1em;color:#888;">Hola, ${nombre}!</div>`;

  const balanceDisplay = document.createElement('h3');
  balanceDisplay.textContent = 'Balance: S/ 0.00';
  balanceDisplay.style.cssText = `text-align: center; color: #2c3e50; font-size: 1.2em;`;

  const resumen = document.createElement('div');
  resumen.style.cssText = `
    display: flex; gap: 15px; justify-content: center; margin-bottom: 20px;
  `;
  resumen.innerHTML = `
    <div style="flex:1; background:#e9f7ef; border-radius:8px; padding:16px; text-align:center;">
      <i class="fa-solid fa-arrow-up" style="color:#27ae60; font-size:1.5em;"></i>
      <div style="color:#27ae60; font-weight:bold;">Ingresos</div>
      <div id="resumen-ingresos" style="font-size:1.2em;">S/ 0.00</div>
    </div>
    <div style="flex:1; background:#fcebea; border-radius:8px; padding:16px; text-align:center;">
      <i class="fa-solid fa-arrow-down" style="color:#e74c3c; font-size:1.5em;"></i>
      <div style="color:#e74c3c; font-weight:bold;">Gastos</div>
      <div id="resumen-gastos" style="font-size:1.2em;">S/ 0.00</div>
    </div>
    <div style="flex:1; background:#f4f6f7; border-radius:8px; padding:16px; text-align:center;">
      <i class="fa-solid fa-wallet" style="color:#2c3e50; font-size:1.5em;"></i>
      <div style="color:#2c3e50; font-weight:bold;">Balance</div>
      <div id="resumen-balance" style="font-size:1.2em;">S/ 0.00</div>
    </div>
  `;

  const form = document.createElement('form');
  form.style.margin = '20px 0';
  form.innerHTML = `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <input id="desc" type="text" placeholder="Descripción" required style="
        flex: 2; padding: 12px; border: 1px solid #ccc; border-radius: 8px;" />
      <input id="amount" type="number" placeholder="Monto" required min="0.01" step="0.01" style="
        flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 8px;" />
    </div>
    <div style="display: flex; gap: 10px;">
      <button id="btn-ingreso" type="button" style="
        flex: 1; padding: 12px; background-color: #2ecc71;
        color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
        <i class="fa-solid fa-arrow-up"></i> Ingreso
      </button>
      <button id="btn-gasto" type="button" style="
        flex: 1; padding: 12px; background-color: #e74c3c;
        color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
        <i class="fa-solid fa-arrow-down"></i> Gasto
      </button>
    </div>
  `;

  const list = document.createElement('ul');
  list.style.cssText = `list-style: none; padding: 0; margin-top: 20px;`;

  // Solo un canvas para el gráfico
  const canvasContainer = document.createElement('div');
  canvasContainer.style.marginTop = '30px';
  canvasContainer.style.background = "#fafbfc";
  canvasContainer.style.borderRadius = "12px";
  canvasContainer.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
  canvasContainer.style.padding = "20px";

  const barCanvas = document.createElement('canvas');
  barCanvas.height = 120;
  canvasContainer.appendChild(barCanvas);

  app.appendChild(resumen);
  app.appendChild(header);
  app.appendChild(balanceDisplay);
  app.appendChild(form);
  app.appendChild(list);
  app.appendChild(canvasContainer);
  document.body.appendChild(app);

  // Filtros arriba de la lista
  const filtros = document.createElement('div');
  filtros.style.cssText = 'display:flex; gap:10px; margin-bottom:10px;';
  filtros.innerHTML = `
    <input id="buscar" type="text" placeholder="Buscar..." style="flex:2; padding:8px; border-radius:6px; border:1px solid #ccc;">
    <select id="tipoFiltro" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ccc;">
      <option value="">Todos</option>
      <option value="ingreso">Ingresos</option>
      <option value="gasto">Gastos</option>
    </select>
  `;
  app.insertBefore(filtros, list);

  // Selector de mes y año
  const fechaFiltro = document.createElement('div');
  fechaFiltro.style.cssText = 'display:flex;gap:10px;margin-bottom:10px;';
  fechaFiltro.innerHTML = `
    <input type="month" id="mesFiltro" style="padding:8px;border-radius:6px;border:1px solid #ccc;">
  `;
  app.insertBefore(fechaFiltro, filtros);

  // ==== LÓGICA ====

  let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

  function guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
  }

  function actualizarUI() {
    list.innerHTML = '';
    let total = 0;
    let ingresos = 0;
    let gastos = 0;

    (filtrarTransacciones()).forEach((t, i) => {
      total += t.monto;
      if (t.monto >= 0) ingresos += t.monto;
      else gastos += Math.abs(t.monto);

      const li = document.createElement('li');
      li.style.cssText = `
        background: ${t.monto >= 0 ? '#e9f7ef' : '#fcebea'};
        color: ${t.monto >= 0 ? '#1e8449' : '#c0392b'};
        border-left: 5px solid ${t.monto >= 0 ? '#27ae60' : '#e74c3c'};
        padding: 12px;
        margin-bottom: 10px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
      `;

      li.innerHTML = `
        <span>
          <strong>${t.descripcion}</strong> <small style="color:#888;">(${t.categoria || 'Sin categoría'})</small><br>
          <small>
            <i class="fa-solid ${t.monto >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            S/ ${Math.abs(t.monto).toFixed(2)}
          </small>
        </span>`;

      const delBtn = document.createElement('button');
      delBtn.textContent = '✖';
      delBtn.style.cssText = `
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
      `;
      delBtn.onclick = () => {
        transacciones.splice(i, 1);
        guardarTransacciones();
        actualizarUI();
      };

      li.appendChild(delBtn);
      list.appendChild(li);
    });

    balanceDisplay.textContent = `Balance: S/ ${total.toFixed(2)}`;
    document.getElementById('resumen-ingresos').textContent = `S/ ${ingresos.toFixed(2)}`;
    document.getElementById('resumen-gastos').textContent = `S/ ${gastos.toFixed(2)}`;
    document.getElementById('resumen-balance').textContent = `S/ ${total.toFixed(2)}`;
    actualizarGraficos(ingresos, gastos);
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc').value.trim();
    const monto = parseFloat(document.getElementById('amount').value);

    if (!desc || isNaN(monto)) return;

    transacciones.push({ descripcion: desc, monto });
    guardarTransacciones();
    actualizarUI();
    form.reset();
    showToast('Transacción agregada'); // Mostrar toast aquí
  };

  const btnIngreso = form.querySelector('#btn-ingreso');
  const btnGasto = form.querySelector('#btn-gasto');
  const descInput = form.querySelector('#desc');
  const amountInput = form.querySelector('#amount');

  btnIngreso.onclick = () => agregarTransaccion('ingreso');
  btnGasto.onclick = () => agregarTransaccion('gasto');

  function agregarTransaccion(tipo) {
    const desc = descInput.value.trim();
    const monto = parseFloat(amountInput.value);

    if (!desc || isNaN(monto) || monto <= 0) return;

    transacciones.push({
      descripcion: desc,
      monto: tipo === 'ingreso' ? monto : -monto,
      categoria: document.getElementById('categoria').value,
      fecha: new Date().toISOString()
    });
    guardarTransacciones();
    actualizarUI();
    form.reset();
    showToast('Transacción agregada'); // Mostrar toast aquí
  }

  // Filtros
  function filtrarTransacciones() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    const tipo = document.getElementById('tipoFiltro').value;
    const mes = document.getElementById('mesFiltro').value;
    return transacciones.filter(t =>
      t.descripcion.toLowerCase().includes(texto) &&
      (tipo === '' || (tipo === 'ingreso' && t.monto >= 0) || (tipo === 'gasto' && t.monto < 0))
    ).filter(t => {
      if (!mes) return true;
      const fecha = t.fecha ? new Date(t.fecha) : new Date();
      return fecha.toISOString().slice(0,7) === mes;
    });
  }

  // ==== GRÁFICOS ====
  let barChart;

  function actualizarGraficos(ingresos, gastos) {
    const datos = [ingresos, gastos];

    if (barChart) barChart.destroy();
    barChart = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
          label: '',
          data: datos,
          backgroundColor: ['#2ecc71', '#e74c3c'],
          borderRadius: 8,
          barPercentage: 0.5,
          categoryPercentage: 0.5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Resumen de Ingresos y Gastos',
            color: '#2c3e50',
            font: { size: 18, weight: 'bold', family: 'Segoe UI' }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `S/ ${context.parsed.x.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#ececec' },
            ticks: { color: '#888', font: { size: 14 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#2c3e50', font: { size: 15, weight: 'bold' } }
          }
        }
      }
    });
  }

  // Lógica de modo oscuro
  darkModeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  };
  // Aplica modo oscuro si estaba activado
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

  // Añade este CSS global:
  const style = document.createElement('style');
  style.textContent = `
    body.dark-mode {
      background: #181a1b !important;
      color: #f1f1f1 !important;
    }
    body.dark-mode div, body.dark-mode input, body.dark-mode form, body.dark-mode ul, body.dark-mode canvas {
      background: #23272a !important;
      color: #f1f1f1 !important;
      border-color: #444 !important;
    }
    body.dark-mode button {
      background: #444 !important;
      color: #fff !important;
    }
  `;
  document.head.appendChild(style);

  document.getElementById('buscar').oninput = actualizarUI;
  document.getElementById('tipoFiltro').onchange = actualizarUI;
  document.getElementById('mesFiltro').onchange = actualizarUI;

  // Añade select de categorías en el form:
  const categorias = ['Salario', 'Comida', 'Transporte', 'Ocio', 'Otros'];
  form.querySelector('div').innerHTML += `
    <select id="categoria" required style="flex:1; padding:12px; border-radius:8px; border:1px solid #ccc;">
      <option value="">Categoría</option>
      ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select>
  `;

  // Toast
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:12px 24px;border-radius:8px;opacity:0;transition:opacity .4s;z-index:9999;';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = 1;
    setTimeout(() => toast.style.opacity = 0, 2000);
  }

  actualizarUI();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
