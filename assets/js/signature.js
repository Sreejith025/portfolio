const signatures = {};

function initSignaturePad(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Set initial canvas styles
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    let lastWidth = 0;

    // Resize canvas to fit its container
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = canvas.parentElement.getBoundingClientRect();
        
        // Prevent unnecessary resize on mobile (e.g. scroll triggering address bar hide)
        if (Math.abs(rect.width - lastWidth) < 1) return;
        lastWidth = rect.width;

        // Save existing drawing using a temporary canvas (synchronous)
        let tempCanvas = null;
        if (canvas.width > 0 && canvas.height > 0) {
            tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
        }

        canvas.width = rect.width * ratio;
        canvas.height = 150 * ratio; // Fixed height of 150px
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '150px';
        ctx.scale(ratio, ratio);
        
        // Context state is reset when width/height changes, so we must restore styles
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        // Restore drawing
        if (tempCanvas) {
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / ratio, tempCanvas.height / ratio);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initialize size

    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getTouchPos(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    }

    function startDrawing(evt) {
        evt.preventDefault();
        isDrawing = true;
        const pos = evt.type.includes('touch') ? getTouchPos(evt) : getMousePos(evt);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(evt) {
        if (!isDrawing) return;
        evt.preventDefault();
        const pos = evt.type.includes('touch') ? getTouchPos(evt) : getMousePos(evt);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function stopDrawing(evt) {
        if (!isDrawing) return;
        evt.preventDefault();
        isDrawing = false;
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    signatures[canvasId] = ctx;
}

function clearSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', () => {
    initSignaturePad('tech-signature');
    initSignaturePad('cust-signature');
});
