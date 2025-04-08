const codeDisplay = document.getElementById('code-display');
const hiddenInput = document.getElementById('hidden-input');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const languageDisplay = document.getElementById('language-display');
const errorsDisplay = document.getElementById('errors');
const timeDisplay = document.getElementById('time');

let startTime;
let errors = 0;
let currentCode = '';
let isGameActive = false;
let currentLanguage = new URLSearchParams(window.location.search).get('lang') || 'c';

const codeSnippets = {
    c: [
        'int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
        'int sum(int arr[], int n) { int total = 0; for(int i = 0; i < n; i++) total += arr[i]; return total; }',
        'void swap(int *a, int *b) { int temp = *a; *a = *b; *b = temp; }',
        'struct Node { int data; struct Node* next; };',
        'int binarySearch(int arr[], int l, int r, int x) { if (r >= l) { int mid = l + (r - l) / 2; if (arr[mid] == x) return mid; if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x); return binarySearch(arr, mid + 1, r, x); } return -1; }',
        'int isPalindrome(char *str) { int l = 0, h = strlen(str) - 1; while (h > l) { if (str[l++] != str[h--]) return 0; } return 1; }',
        'void reverseString(char *str) { int i, j; for (i = 0, j = strlen(str) - 1; i < j; i++, j--) { char temp = str[i]; str[i] = str[j]; str[j] = temp; } }',
        'int findMax(int arr[], int n) { int max = arr[0]; for (int i = 1; i < n; i++) { if (arr[i] > max) max = arr[i]; } return max; }',
        'void bubbleSort(int arr[], int n) { for (int i = 0; i < n-1; i++) for (int j = 0; j < n-i-1; j++) if (arr[j] > arr[j+1]) { int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp; } }'
    ],
    python: [
        'def factorial(n): return 1 if n <= 1 else n * factorial(n - 1)',
        'def sum(arr): return sum(arr)',
        'def is_palindrome(s): return s == s[::-1]',
        'def quick_sort(arr): return arr if len(arr) <= 1 else quick_sort([x for x in arr[1:] if x < arr[0]]) + [arr[0]] + quick_sort([x for x in arr[1:] if x >= arr[0]])',
        'class Node: def __init__(self, data): self.data = data; self.next = None',
        'def binary_search(arr, x): low, high = 0, len(arr) - 1; while low <= high: mid = (low + high) // 2; if arr[mid] == x: return mid; elif arr[mid] < x: low = mid + 1; else: high = mid - 1; return -1',
        'def reverse_string(s): return s[::-1]',
        'def find_max(arr): return max(arr)',
        'def bubble_sort(arr): n = len(arr); for i in range(n): for j in range(0, n-i-1): if arr[j] > arr[j+1]: arr[j], arr[j+1] = arr[j+1], arr[j]; return arr'
    ],
    java: [
        'public static int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
        'public static int sum(int[] arr) { return Arrays.stream(arr).sum(); }',
        'public static boolean isPalindrome(String str) { return str.equals(new StringBuilder(str).reverse().toString()); }',
        'public static <T extends Comparable<T>> List<T> quickSort(List<T> list) { if (list.size() <= 1) return list; T pivot = list.get(0); List<T> less = list.stream().skip(1).filter(e -> e.compareTo(pivot) < 0).collect(Collectors.toList()); List<T> greater = list.stream().skip(1).filter(e -> e.compareTo(pivot) >= 0).collect(Collectors.toList()); List<T> sorted = new ArrayList<>(quickSort(less)); sorted.add(pivot); sorted.addAll(quickSort(greater)); return sorted; }',
        'public class Node<T> { T data; Node<T> next; public Node(T data) { this.data = data; this.next = null; } }',
        'public static int binarySearch(int[] arr, int x) { int low = 0, high = arr.length - 1; while (low <= high) { int mid = (low + high) / 2; if (arr[mid] == x) return mid; else if (arr[mid] < x) low = mid + 1; else high = mid - 1; } return -1; }',
        'public static String reverseString(String str) { return new StringBuilder(str).reverse().toString(); }',
        'public static int findMax(int[] arr) { return Arrays.stream(arr).max().getAsInt(); }',
        'public static void bubbleSort(int[] arr) { int n = arr.length; for (int i = 0; i < n-1; i++) for (int j = 0; j < n-i-1; j++) if (arr[j] > arr[j+1]) { int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp; } }'
    ],
    go: [
        'func factorial(n int) int { if n <= 1 { return 1 }; return n * factorial(n - 1) }',
        'func sum(arr []int) int { total := 0; for _, v := range arr { total += v }; return total }',
        'func isPalindrome(s string) bool { for i := 0; i < len(s)/2; i++ { if s[i] != s[len(s)-1-i] { return false } }; return true }',
        'func quickSort(arr []int) []int { if len(arr) <= 1 { return arr }; pivot := arr[0]; var less, greater []int; for _, v := range arr[1:] { if v < pivot { less = append(less, v) } else { greater = append(greater, v) } }; return append(append(quickSort(less), pivot), quickSort(greater)...) }',
        'type Node struct { data int; next *Node }',
        'func binarySearch(arr []int, x int) int { low, high := 0, len(arr)-1; for low <= high { mid := (low + high) / 2; if arr[mid] == x { return mid } else if arr[mid] < x { low = mid + 1 } else { high = mid - 1 } }; return -1 }',
        'func reverseString(s string) string { runes := []rune(s); for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 { runes[i], runes[j] = runes[j], runes[i] }; return string(runes) }',
        'func findMax(arr []int) int { max := arr[0]; for _, v := range arr { if v > max { max = v } }; return max }',
        'func bubbleSort(arr []int) []int { n := len(arr); for i := 0; i < n-1; i++ { for j := 0; j < n-i-1; j++ { if arr[j] > arr[j+1] { arr[j], arr[j+1] = arr[j+1], arr[j] } } }; return arr }'
    ]
};


function getRandomCode() {
    const snippets = codeSnippets[currentLanguage];
    return snippets[Math.floor(Math.random() * snippets.length)];
}

function updateCodeDisplay() {
    codeDisplay.textContent = currentCode;
}

function initGame(newCode = true) {
    isGameActive = true;
    errors = 0;
    if (newCode) {
        currentCode = getRandomCode();
    }
    updateCodeDisplay();
    startBtn.disabled = true;
    endBtn.disabled = false;
    restartBtn.disabled = false;
    hiddenInput.value = '';
    hiddenInput.focus();
    startTime = new Date();
    updateStats();
    animateCodeDisplay();
    languageDisplay.textContent = `Language: ${currentLanguage.toUpperCase()}`;
}

function startGame() {
    initGame(true);
}

function endGame(isCompleted = false) {
    isGameActive = false;
    hiddenInput.blur();
    startBtn.disabled = false;
    endBtn.disabled = true;
    restartBtn.disabled = false;
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    
    const totalCharacters = currentCode.length;
    const errorPercentage = (errors / totalCharacters) * 100;
    
    const resultsHTML = `
        <div class="results">
            <h2>${isCompleted ? 'Completed!' : 'Game Ended'}</h2>
            <p>Errors: <span class="highlight">${errors}</span></p>
            <p>Error Rate: <span class="highlight">${errorPercentage.toFixed(2)}%</span></p>
        </div>
    `;
    
    codeDisplay.insertAdjacentHTML('beforeend', resultsHTML);
}

function updateStats() {
    errorsDisplay.textContent = `Errors: ${errors}`;
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;
    timeDisplay.textContent = `Time: ${elapsedTime.toFixed(1)}s`;
    if (isGameActive) {
        requestAnimationFrame(updateStats);
    }
}

function checkErrors() {
    const userInput = hiddenInput.value;
    let htmlContent = '';
    errors = 0;

    for (let i = 0; i < currentCode.length; i++) {
        if (i < userInput.length) {
            if (userInput[i] === currentCode[i]) {
                htmlContent += `<span class="correct">${currentCode[i]}</span>`;
            } else {
                htmlContent += `<span class="incorrect">${currentCode[i]}</span>`;
                errors++;
            }
        } else {
            htmlContent += currentCode[i];
        }
    }

    codeDisplay.innerHTML = htmlContent;

    if (userInput.length === currentCode.length) {
        endGame(true);
    }
}

function restartGame() {
    const existingResults = codeDisplay.querySelector('.results');
    if (existingResults) {
        existingResults.remove();
    }
    initGame(false);
}

function animateCodeDisplay() {
    codeDisplay.style.transform = 'scale(0.95)';
    codeDisplay.style.opacity = '0.5';
    setTimeout(() => {
        codeDisplay.style.transform = 'scale(1)';
        codeDisplay.style.opacity = '1';
    }, 100);
}

hiddenInput.addEventListener('input', () => {
    if (isGameActive) {
        checkErrors();
    }
});



function switchCode() {
    if (!isGameActive) return;
    
    const languageSnippets = codeSnippets[currentLanguage];
    
    const currentCodeIndex = languageSnippets.indexOf(currentCode);
    
    const nextCodeIndex = (currentCodeIndex + 1) % languageSnippets.length;
    currentCode = languageSnippets[nextCodeIndex];
    
    updateCodeDisplay();
    hiddenInput.value = '';
    errors = 0;
}



const switchBtn = document.getElementById('switch-btn');
switchBtn.addEventListener('click', switchCode);
startBtn.addEventListener('click', startGame);
endBtn.addEventListener('click', () => endGame(false));
restartBtn.addEventListener('click', restartGame);
backBtn.addEventListener('click', () => window.location.href = 'index.html');


startGame();
