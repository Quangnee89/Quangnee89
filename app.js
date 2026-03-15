/* ===== Data Configuration (Easy to modify) ===== */

// Model metrics data — update values here when you have real results
const MODEL_METRICS = [
    {
        name: "Logistic Regression",
        accuracy: "87.2%",
        f1Score: "86.8%",
        note: "Nhanh, phù hợp dữ liệu tuyến tính"
    },
    {
        name: "Naive Bayes",
        accuracy: "83.5%",
        f1Score: "82.9%",
        note: "Đơn giản, hiệu quả với văn bản"
    },
    {
        name: "SVM",
        accuracy: "88.1%",
        f1Score: "87.6%",
        note: "Hiệu suất cao, tốt với TF‑IDF"
    },
    {
        name: "Random Forest",
        accuracy: "85.7%",
        f1Score: "85.2%",
        note: "Ổn định, ít overfitting"
    }
];

// Example sentences for quick testing
const EXAMPLE_SENTENCES = [
    "Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!",
    "Hàng bị lỗi, giao chậm 3 ngày, không liên lạc được với shop.",
    "Sản phẩm tạm ổn, không có gì đặc biệt, đúng mô tả.",
    "Chất lượng tuyệt vời, sẽ mua lại lần sau. 5 sao!",
    "Hàng nhận được khác hoàn toàn với hình ảnh, thất vọng.",
    "Giao hàng đúng hẹn, sản phẩm dùng được, giá hợp lý."
];

/* ===== Mock Prediction Function ===== */
// Replace this function with a real API call later
function predictSentiment(comment, model) {
    // Simulate processing delay
    return new Promise(function(resolve) {
        var delay = 800 + Math.random() * 1200;
        setTimeout(function() {
            // Simple keyword-based mock for more realistic demo
            var lowerComment = comment.toLowerCase();

            var positiveWords = ["tốt", "tuyệt", "hài lòng", "nhanh", "đẹp", "chất lượng", "5 sao", "mua lại", "cẩn thận", "tuyệt vời", "xuất sắc", "thích"];
            var negativeWords = ["lỗi", "chậm", "thất vọng", "tệ", "xấu", "hỏng", "dở", "kém", "không liên lạc", "khác hoàn toàn", "không hài lòng", "tồi"];

            var posCount = 0;
            var negCount = 0;

            for (var i = 0; i < positiveWords.length; i++) {
                if (lowerComment.includes(positiveWords[i])) posCount++;
            }
            for (var j = 0; j < negativeWords.length; j++) {
                if (lowerComment.includes(negativeWords[j])) negCount++;
            }

            var sentiment, confidence;

            if (posCount > negCount) {
                sentiment = "positive";
                confidence = 0.7 + Math.random() * 0.25;
            } else if (negCount > posCount) {
                sentiment = "negative";
                confidence = 0.7 + Math.random() * 0.25;
            } else {
                sentiment = "neutral";
                confidence = 0.5 + Math.random() * 0.3;
            }

            // Add slight model variation
            var modelVariation = {
                logistic_regression: 0.02,
                naive_bayes: -0.03,
                svm: 0.04,
                random_forest: 0.01
            };
            confidence = Math.min(0.99, confidence + (modelVariation[model] || 0));

            resolve({
                sentiment: sentiment,
                confidence: confidence,
                model: model
            });
        }, delay);
    });
}

/* ===== Sentiment Labels & Config ===== */
var SENTIMENT_CONFIG = {
    positive: { label: "Tích cực", icon: "😊", cssClass: "positive" },
    neutral:  { label: "Trung tính", icon: "😐", cssClass: "neutral" },
    negative: { label: "Tiêu cực", icon: "😞", cssClass: "negative" }
};

var MODEL_NAMES = {
    logistic_regression: "Logistic Regression",
    naive_bayes: "Naive Bayes",
    svm: "SVM",
    random_forest: "Random Forest"
};

/* ===== DOM Elements ===== */
var commentInput = document.getElementById("commentInput");
var modelSelect = document.getElementById("modelSelect");
var analyzeBtn = document.getElementById("analyzeBtn");
var resultArea = document.getElementById("resultArea");
var examplesList = document.getElementById("examplesList");
var metricsTableBody = document.getElementById("metricsTableBody");
var menuToggle = document.getElementById("menuToggle");
var navMenu = document.getElementById("navMenu");
var header = document.getElementById("header");

/* ===== Initialize ===== */
document.addEventListener("DOMContentLoaded", function() {
    renderExamples();
    renderMetricsTable();
    setupEventListeners();
});

/* ===== Render Example Sentences ===== */
function renderExamples() {
    examplesList.innerHTML = "";
    EXAMPLE_SENTENCES.forEach(function(sentence) {
        var chip = document.createElement("button");
        chip.className = "example-chip";
        chip.textContent = sentence.length > 50 ? sentence.substring(0, 50) + "…" : sentence;
        chip.title = sentence;
        chip.addEventListener("click", function() {
            commentInput.value = sentence;
            commentInput.focus();
        });
        examplesList.appendChild(chip);
    });
}

/* ===== Render Metrics Table ===== */
function renderMetricsTable() {
    metricsTableBody.innerHTML = "";
    MODEL_METRICS.forEach(function(m) {
        var tr = document.createElement("tr");
        tr.innerHTML =
            '<td class="model-name">' + escapeHtml(m.name) + '</td>' +
            '<td><span class="badge badge-green">' + escapeHtml(m.accuracy) + '</span></td>' +
            '<td><span class="badge badge-blue">' + escapeHtml(m.f1Score) + '</span></td>' +
            '<td>' + escapeHtml(m.note) + '</td>';
        metricsTableBody.appendChild(tr);
    });
}

/* ===== Event Listeners ===== */
function setupEventListeners() {
    // Analyze button
    analyzeBtn.addEventListener("click", handleAnalyze);

    // Enter key in textarea (Ctrl+Enter)
    commentInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            handleAnalyze();
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener("click", function() {
        menuToggle.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    // Close mobile menu on link click
    document.querySelectorAll(".nav-link").forEach(function(link) {
        link.addEventListener("click", function() {
            menuToggle.classList.remove("open");
            navMenu.classList.remove("open");
        });
    });

    // Header scroll shadow
    window.addEventListener("scroll", function() {
        if (window.scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

/* ===== Handle Analyze ===== */
function handleAnalyze() {
    var comment = commentInput.value.trim();

    if (!comment) {
        showError("Vui lòng nhập bình luận để phân tích.");
        commentInput.focus();
        return;
    }

    var model = modelSelect.value;

    // Show loading
    showLoading();
    analyzeBtn.disabled = true;

    predictSentiment(comment, model).then(function(result) {
        showResult(result, comment);
        analyzeBtn.disabled = false;
    }).catch(function() {
        showError("Có lỗi xảy ra. Vui lòng thử lại.");
        analyzeBtn.disabled = false;
    });
}

/* ===== Show Loading ===== */
function showLoading() {
    resultArea.innerHTML =
        '<div style="text-align:center">' +
            '<div class="spinner"></div>' +
            '<p class="loading-text">Đang phân tích cảm xúc...</p>' +
        '</div>';
}

/* ===== Show Result ===== */
function showResult(result, comment) {
    var config = SENTIMENT_CONFIG[result.sentiment];
    var confidencePercent = Math.round(result.confidence * 100);
    var modelName = MODEL_NAMES[result.model] || result.model;

    resultArea.innerHTML =
        '<div class="result-display">' +
            '<div class="result-sentiment ' + config.cssClass + '">' +
                '<span class="result-sentiment-icon">' + config.icon + '</span>' +
                '<span>' + escapeHtml(config.label) + '</span>' +
            '</div>' +
            '<div class="result-details">' +
                '<div class="result-detail-row">' +
                    '<span class="result-detail-label">Mô hình</span>' +
                    '<span class="result-detail-value">' + escapeHtml(modelName) + '</span>' +
                '</div>' +
                '<div class="result-detail-row">' +
                    '<span class="result-detail-label">Độ tự tin</span>' +
                    '<span class="result-detail-value">' +
                        confidencePercent + '% ' +
                        '<span class="confidence-bar">' +
                            '<span class="confidence-fill ' + config.cssClass + '" style="width:' + confidencePercent + '%"></span>' +
                        '</span>' +
                    '</span>' +
                '</div>' +
                '<div class="result-detail-row">' +
                    '<span class="result-detail-label">Bình luận</span>' +
                    '<span class="result-detail-value" style="max-width:260px;word-break:break-word;text-align:right">' +
                        escapeHtml(comment.length > 80 ? comment.substring(0, 80) + '…' : comment) +
                    '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
}

/* ===== Show Error ===== */
function showError(message) {
    resultArea.innerHTML =
        '<div style="text-align:center;color:var(--negative)">' +
            '<span style="font-size:2rem">⚠️</span>' +
            '<p style="margin-top:8px">' + escapeHtml(message) + '</p>' +
        '</div>';
}

/* ===== Utility: Escape HTML ===== */
function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
