"""Markup for the standalone game and its landing invitation."""
from html import escape

ACTIONS = (
    ("left", "Mover a la izquierda", "←"),
    ("right", "Mover a la derecha", "→"),
    ("soft", "Caída lenta", "↓"),
    ("hard", "Caída rápida", "Espacio"),
    ("ccw", "Rotar a la izquierda", "V"),
    ("cw", "Rotar a la derecha", "↑"),
    ("half", "Rotar 180°", "X"),
    ("hold", "Reservar pieza", "C"),
)


def game_art():
    return """<svg class="game-invite-art" viewBox="0 0 280 224" aria-hidden="true" focusable="false">
    <defs><pattern id="tetris-invite-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M0 28V0H28" fill="none" stroke="currentColor" stroke-opacity=".34"/>
    </pattern></defs>
    <g class="tetris-example-stack">
    <path d="M0 112h168v112H0zM196 112h84v112h-84z" fill="#467580"/>
    <path d="M0 112h56v56H0zM84 168h84v28h-56v28H84z" fill="#b6bc9f"/>
    <path d="M196 112h84v28h-56v28h-28zM28 168h56v28H56v28H0v-28h28z" fill="#df917d"/>
    <path d="M168 112h28v112h-28z" fill="#e8b769" fill-opacity=".14" stroke="#e8b769" stroke-dasharray="4 4"/>
    </g><g class="tetris-example-piece">
    <path d="M168 0h28v112h-28z" fill="#e8b769"/>
    <path d="M168 28h28m-28 28h28m-28 28h28" stroke="#102e38" stroke-opacity=".65"/>
    </g><rect width="280" height="224" fill="url(#tetris-invite-grid)"/>
    </svg>"""


def render_game():
    keys = "".join(
        f'<div class="game-binding"><label for="key-{action}">{escape(label)}</label>'
        f'<button id="key-{action}" type="button" data-bind="{action}" aria-label="{escape(label)}: {key}">{key}</button></div>'
        for action, label, key in ACTIONS
    )
    touch_symbols = {"hold": "▣", "left": "←", "right": "→", "soft": "↓", "ccw": "↶", "cw": "↷", "hard": "⇊"}
    touch_labels = {action: label for action, label, _ in ACTIONS}
    touch = "".join(
        f'<button type="button" data-touch="{action}" aria-label="{escape(touch_labels[action])}">{symbol}</button>'
        for action, symbol in touch_symbols.items()
    )
    return f"""<section class="game-page" data-tetris>
    <svg class="game-backdrop" viewBox="0 0 1440 880" aria-hidden="true" focusable="false">
      <g class="game-backdrop-outline">
        <path d="M-44 252H140V344H232V436H-44ZM48 252V436M140 344H-44M140 344V436"/>
        <path d="M1120 105H1396V197H1304V289H1212V197H1120ZM1212 105V197M1304 105V197M1212 197H1304"/>
      </g>
      <g class="game-backdrop-pieces">
        <path class="game-backdrop-coral" d="M88 558H160V630H232V702H88Z"/>
        <path class="game-backdrop-amber" d="M1280 460H1424V604H1280Z"/>
        <path class="game-backdrop-petrol" d="M1140 690H1356V762H1284V834H1212V762H1140Z"/>
      </g>
      <path class="game-backdrop-guides" d="M24 510H255M255 510V770M1180 362H1416M1180 362V622"/>
    </svg>
    <div class="wrap game-wrap">
    <nav class="breadcrumb" aria-label="Ruta de navegación"><a href="../#una-partida">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Pausa de Tetris</span></nav>
    <div class="game-heading"><div><p class="eyebrow">Entre proyectos</p><h1>Pausa de Tetris<span class="orange">.</span></h1></div>
    <div class="game-intro"><p>Siempre vuelvo al Tetris por ese momento en que guardas un hueco y, justo a tiempo, llega la pieza que esperabas. Si te apetece una pausa, te invito a intentar superar tu propia marca.</p></div></div>
    <noscript><p>Activa JavaScript para jugar en el navegador.</p></noscript>
    <div class="game-shell" hidden>
      <dl class="game-score">
        <div><dt>Puntos</dt><dd data-stat="score">0</dd></div>
        <div><dt>Récord</dt><dd data-stat="best">0</dd><dd class="game-record-time" data-record-time hidden></dd></div>
        <div><dt>Tiempo</dt><dd data-stat="time">00:00</dd></div>
        <div><dt>Líneas</dt><dd data-stat="lines">0</dd></div>
        <div><dt>Nivel</dt><dd data-stat="level">1</dd></div>
      </dl>
      <div class="game-grid">
        <aside class="game-hold"><h2>Reserva</h2><canvas data-hold width="144" height="104" aria-label="Reserva vacía"></canvas></aside>
        <div class="game-board" tabindex="0" role="group" aria-label="Tablero de Tetris">
          <canvas data-board width="300" height="600" aria-label="Tablero de diez columnas y veinte filas">Tablero de Tetris.</canvas>
          <div class="game-tetris-callout" hidden aria-hidden="true">
            <strong data-celebration-title></strong>
            <span data-celebration-detail></span>
          </div>
          <div class="game-overlay">
            <h2 data-game-title>Partida individual</h2>
            <p data-game-message>Completa filas y supera tu mejor puntaje.</p>
            <button type="button" class="button strong" data-game-primary>Empezar</button>
            <button type="button" class="button game-rank-open" data-ranking-open hidden>Publicar marca</button>
          </div>
        </div>
        <aside class="game-next"><h2>Próximas</h2><canvas data-next width="144" height="300" aria-label="Próximas tres piezas"></canvas></aside>
      </div>
      <div class="game-touch-panel" hidden>
        <div class="game-touch" role="group" aria-label="Controles táctiles">{touch}</div>
        <button type="button" class="button touch-edit" data-touch-edit aria-expanded="false" aria-controls="touch-edit-tools">Ordenar botones</button>
        <div id="touch-edit-tools" hidden>
          <p class="game-touch-instructions">Arrastra un botón a su nueva posición o toca un botón y luego el lugar donde quieres moverlo.</p>
          <button type="button" class="button touch-edit" data-touch-reset>Restaurar orden</button>
        </div>
        <p class="game-touch-status" data-touch-status role="status"></p>
      </div>
      <div class="game-actions">
        <button type="button" class="button" data-game-pause aria-keyshortcuts="Enter" disabled>Pausar</button>
        <button type="button" class="button" data-game-restart disabled>Reiniciar</button>
        <button type="button" class="button" data-game-settings>Configurar controles</button>
      </div>
      <label class="game-touch-option"><input type="checkbox" data-touch-option> Habilitar controles táctiles</label>
      <p class="game-last-result" data-last-result hidden></p>
      <p class="game-status" role="status"></p>
    </div>
    <details class="game-ranking" hidden>
      <summary>Ranking <span>Top 10</span></summary>
      <div class="game-ranking-body">
        <p data-ranking-status role="status"></p>
        <button type="button" class="button" data-ranking-retry hidden>Reintentar</button>
        <ol data-ranking-list hidden></ol>
      </div>
    </details>
    <dialog class="game-rank-dialog" aria-labelledby="rank-ticket-title">
      <form data-ranking-form>
        <p class="rank-ticket-kicker">Pausa de Tetris</p>
        <h2 id="rank-ticket-title">Tu marca<span class="orange">.</span></h2>
        <dl class="rank-ticket-results">
          <div><dt>Puntos</dt><dd data-ranking-score>0</dd></div>
          <div><dt>Tiempo</dt><dd data-ranking-time>00:00</dd></div>
        </dl>
        <div class="rank-ticket-alias">
          <label for="tetris-alias">Alias público</label><span data-ranking-count aria-hidden="true">0/10</span>
          <input id="tetris-alias" name="alias" maxlength="10" required autocomplete="off" spellcheck="false" placeholder="Tu alias" aria-describedby="tetris-alias-hint" autofocus>
          <span class="rank-ticket-meter" data-ranking-meter aria-hidden="true"></span>
          <span class="game-status" id="tetris-alias-hint">Hasta 10 caracteres. El alias, el puntaje y el tiempo se publican juntos.</span>
        </div>
        <p class="rank-ticket-feedback" data-ranking-feedback role="status"></p>
        <div class="rank-ticket-actions">
          <button type="button" class="button" data-ranking-dismiss>Ahora no</button>
          <button type="submit" class="button strong" data-ranking-submit>Publicar marca</button>
          <button type="button" class="button strong" data-ranking-view hidden>Ver Top 10</button>
        </div>
      </form>
    </dialog>
    <dialog class="game-dialog" aria-labelledby="game-dialog-title">
      <form method="dialog">
        <h2 id="game-dialog-title">Configurar controles</h2>
        <p>Elige un campo y presiona una tecla. Escape cancela la asignación.</p>
        <div class="game-bindings">{keys}</div>
        <p class="game-binding-status" role="status"></p>
        <div class="game-dialog-actions">
          <button type="button" class="button" data-game-reset>Restablecer controles</button>
          <button class="button strong" value="save">Guardar y cerrar</button>
        </div>
      </form>
    </dialog></div></section>"""
