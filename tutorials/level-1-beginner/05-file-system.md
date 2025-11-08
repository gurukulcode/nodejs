# Lesson 5: File System Operations

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Read and write files using the fs module
- Understand synchronous vs asynchronous file operations
- Work with directories and paths
- Use streams for large files
- Handle file watching and monitoring

---

## The fs Module

The `fs` (File System) module provides an API for interacting with the file system.

```javascript
const fs = require('fs');

// Or use promises API (recommended)
const fs = require('fs').promises;

// Or use promise-based fs
const fsPromises = require('fs/promises');
```

---

## Reading Files

### Asynchronous (Callback-based)

```javascript
// read-async.js
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File contents:', data);
});

console.log('This runs first!');
```

### Synchronous (Blocking)

```javascript
// read-sync.js
const fs = require('fs');

try {
    const data = fs.readFileSync('example.txt', 'utf8');
    console.log('File contents:', data);
} catch (err) {
    console.error('Error reading file:', err);
}

console.log('This runs after!');
```

### Promise-based (Modern Approach)

```javascript
// read-promises.js
const fs = require('fs').promises;

async function readFile() {
    try {
        const data = await fs.readFile('example.txt', 'utf8');
        console.log('File contents:', data);
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

readFile();
```

### When to Use Each:

- **Async (Promises)**: Default choice for most operations
- **Async (Callbacks)**: Legacy code or specific use cases
- **Sync**: Only for initialization or CLI tools

---

## Writing Files

### Write (Overwrite)

```javascript
// write-file.js
const fs = require('fs').promises;

async function writeFile() {
    try {
        await fs.writeFile('output.txt', 'Hello, World!', 'utf8');
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

writeFile();
```

### Append to File

```javascript
// append-file.js
const fs = require('fs').promises;

async function appendToFile() {
    try {
        await fs.appendFile('log.txt', 'New log entry\n', 'utf8');
        console.log('Content appended');
    } catch (err) {
        console.error('Error appending to file:', err);
    }
}

appendToFile();
```

---

## File Metadata

### Check if File Exists

```javascript
// check-exists.js
const fs = require('fs').promises;

async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

// Usage
(async () => {
    const exists = await fileExists('example.txt');
    console.log('File exists:', exists);
})();
```

### Get File Stats

```javascript
// file-stats.js
const fs = require('fs').promises;

async function getFileInfo(path) {
    try {
        const stats = await fs.stat(path);

        console.log('File Information:');
        console.log('Size:', stats.size, 'bytes');
        console.log('Created:', stats.birthtime);
        console.log('Modified:', stats.mtime);
        console.log('Is File:', stats.isFile());
        console.log('Is Directory:', stats.isDirectory());

    } catch (err) {
        console.error('Error:', err.message);
    }
}

getFileInfo('example.txt');
```

---

## Working with Directories

### Create Directory

```javascript
// create-dir.js
const fs = require('fs').promises;
const path = require('path');

async function createDirectory(dirPath) {
    try {
        // Create single directory
        await fs.mkdir(dirPath);
        console.log('Directory created');

        // Create nested directories
        await fs.mkdir('parent/child/grandchild', { recursive: true });
        console.log('Nested directories created');

    } catch (err) {
        console.error('Error:', err.message);
    }
}

createDirectory('./my-folder');
```

### Read Directory Contents

```javascript
// read-dir.js
const fs = require('fs').promises;
const path = require('path');

async function listFiles(dirPath) {
    try {
        const files = await fs.readdir(dirPath);

        console.log(`Contents of ${dirPath}:`);
        for (const file of files) {
            console.log('  -', file);
        }

        // With file types
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        console.log('\nDetailed listing:');
        for (const entry of entries) {
            const type = entry.isDirectory() ? 'DIR' : 'FILE';
            console.log(`  [${type}] ${entry.name}`);
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
}

listFiles('./');
```

### Recursive Directory Reading

```javascript
// recursive-read.js
const fs = require('fs').promises;
const path = require('path');

async function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
            arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    }

    return arrayOfFiles;
}

// Usage
(async () => {
    const allFiles = await getAllFiles('./');
    console.log('All files:', allFiles);
})();
```

### Remove Directory

```javascript
// remove-dir.js
const fs = require('fs').promises;

async function removeDirectory(dirPath) {
    try {
        // Remove empty directory
        await fs.rmdir(dirPath);

        // Remove directory with contents (Node.js 14.14+)
        await fs.rm(dirPath, { recursive: true, force: true });

        console.log('Directory removed');
    } catch (err) {
        console.error('Error:', err.message);
    }
}
```

---

## Path Operations

The `path` module helps work with file paths across platforms:

```javascript
// path-operations.js
const path = require('path');

// Join paths
const fullPath = path.join('/users', 'john', 'documents', 'file.txt');
console.log('Joined path:', fullPath);

// Resolve absolute path
const absolutePath = path.resolve('documents', 'file.txt');
console.log('Absolute path:', absolutePath);

// Get directory name
console.log('Directory:', path.dirname('/users/john/file.txt'));

// Get file name
console.log('Basename:', path.basename('/users/john/file.txt'));

// Get extension
console.log('Extension:', path.extname('file.txt'));

// Parse path
const parsed = path.parse('/users/john/file.txt');
console.log('Parsed:', parsed);
// {
//   root: '/',
//   dir: '/users/john',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Format path
const formatted = path.format({
    dir: '/users/john',
    name: 'file',
    ext: '.txt'
});
console.log('Formatted:', formatted);

// Normalize path
console.log('Normalized:', path.normalize('/users//john/./documents/../file.txt'));
// Output: /users/john/file.txt

// Check if absolute
console.log('Is absolute:', path.isAbsolute('/users/john'));

// Relative path
console.log('Relative:', path.relative('/users/john', '/users/jane/file.txt'));
```

---

## Streams

Streams are efficient for handling large files:

### Reading with Streams

```javascript
// read-stream.js
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 16 * 1024 // 16KB chunks
});

readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.length, 'characters');
});

readStream.on('end', () => {
    console.log('Finished reading file');
});

readStream.on('error', (err) => {
    console.error('Error:', err);
});
```

### Writing with Streams

```javascript
// write-stream.js
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.end('Final line\n');

writeStream.on('finish', () => {
    console.log('Finished writing');
});

writeStream.on('error', (err) => {
    console.error('Error:', err);
});
```

### Piping Streams (Copy File)

```javascript
// pipe-streams.js
const fs = require('fs');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
    console.log('File copied successfully');
});
```

### Transform Stream

```javascript
// transform-stream.js
const fs = require('fs');
const { Transform } = require('stream');

// Create uppercase transformer
const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

fs.createReadStream('input.txt')
    .pipe(upperCaseTransform)
    .pipe(fs.createWriteStream('output.txt'))
    .on('finish', () => console.log('Transformation complete'));
```

---

## File Watching

Monitor file changes in real-time:

```javascript
// watch-file.js
const fs = require('fs');

// Watch a specific file
fs.watch('config.json', (eventType, filename) => {
    console.log(`Event: ${eventType} on ${filename}`);

    if (eventType === 'change') {
        console.log('File was modified');
    }
});

// Watch a directory
fs.watch('./data', { recursive: true }, (eventType, filename) => {
    console.log(`${filename} was ${eventType}d`);
});

console.log('Watching for file changes...');
```

### Using watchFile (polling-based)

```javascript
// watch-file-polling.js
const fs = require('fs');

fs.watchFile('important.txt', { interval: 1000 }, (curr, prev) => {
    console.log('File changed!');
    console.log(`Previous size: ${prev.size}`);
    console.log(`Current size: ${curr.size}`);
});
```

---

## Practical Projects

### Project 1: File Logger

```javascript
// logger.js
const fs = require('fs').promises;
const path = require('path');

class FileLogger {
    constructor(logDir = './logs') {
        this.logDir = logDir;
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (err) {
            console.error('Failed to create log directory:', err);
        }
    }

    getLogFileName() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}.log`;
    }

    async log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        const logFile = path.join(this.logDir, this.getLogFileName());

        try {
            await fs.appendFile(logFile, logEntry);
        } catch (err) {
            console.error('Failed to write log:', err);
        }
    }

    async info(message) {
        await this.log('info', message);
    }

    async error(message) {
        await this.log('error', message);
    }

    async warn(message) {
        await this.log('warn', message);
    }

    async getLogs(date) {
        const logFile = path.join(this.logDir, `${date}.log`);
        try {
            return await fs.readFile(logFile, 'utf8');
        } catch (err) {
            return 'No logs found for this date';
        }
    }
}

// Usage
(async () => {
    const logger = new FileLogger();

    await logger.info('Application started');
    await logger.error('An error occurred');
    await logger.warn('Warning message');

    // Read logs
    const today = new Date().toISOString().split('T')[0];
    const logs = await logger.getLogs(today);
    console.log('Today\'s logs:\n', logs);
})();
```

### Project 2: File Search Tool

```javascript
// file-search.js
const fs = require('fs').promises;
const path = require('path');

class FileSearcher {
    async search(dirPath, pattern) {
        const results = [];
        await this._searchRecursive(dirPath, pattern, results);
        return results;
    }

    async _searchRecursive(dirPath, pattern, results) {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    await this._searchRecursive(fullPath, pattern, results);
                } else if (this._matchPattern(entry.name, pattern)) {
                    const stats = await fs.stat(fullPath);
                    results.push({
                        path: fullPath,
                        name: entry.name,
                        size: stats.size,
                        modified: stats.mtime
                    });
                }
            }
        } catch (err) {
            console.error(`Error reading ${dirPath}:`, err.message);
        }
    }

    _matchPattern(filename, pattern) {
        if (pattern instanceof RegExp) {
            return pattern.test(filename);
        }
        return filename.includes(pattern);
    }

    async searchByExtension(dirPath, extension) {
        const pattern = new RegExp(`\\.${extension}$`, 'i');
        return await this.search(dirPath, pattern);
    }

    async searchBySize(dirPath, minSize, maxSize) {
        const allFiles = await this.search(dirPath, '');
        return allFiles.filter(file => {
            return file.size >= minSize && file.size <= maxSize;
        });
    }
}

// Usage
(async () => {
    const searcher = new FileSearcher();

    // Search for all .js files
    const jsFiles = await searcher.searchByExtension('./', 'js');
    console.log(`Found ${jsFiles.length} JavaScript files`);

    // Search by name pattern
    const configFiles = await searcher.search('./', 'config');
    console.log('Config files:', configFiles.map(f => f.name));

    // Search by size (1KB to 1MB)
    const mediumFiles = await searcher.searchBySize('./', 1024, 1024 * 1024);
    console.log(`Found ${mediumFiles.length} medium-sized files`);
})();
```

### Project 3: File Organizer

```javascript
// file-organizer.js
const fs = require('fs').promises;
const path = require('path');

class FileOrganizer {
    constructor(sourceDir) {
        this.sourceDir = sourceDir;
    }

    async organizeByExtension() {
        const files = await fs.readdir(this.sourceDir);

        for (const file of files) {
            const filePath = path.join(this.sourceDir, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile()) {
                const ext = path.extname(file).slice(1) || 'no-extension';
                const targetDir = path.join(this.sourceDir, ext);

                await fs.mkdir(targetDir, { recursive: true });

                const targetPath = path.join(targetDir, file);
                await fs.rename(filePath, targetPath);

                console.log(`Moved ${file} to ${ext}/`);
            }
        }

        console.log('Organization complete!');
    }

    async organizeByDate() {
        const files = await fs.readdir(this.sourceDir);

        for (const file of files) {
            const filePath = path.join(this.sourceDir, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile()) {
                const date = stats.mtime;
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');

                const targetDir = path.join(this.sourceDir, `${year}-${month}`);
                await fs.mkdir(targetDir, { recursive: true });

                const targetPath = path.join(targetDir, file);
                await fs.rename(filePath, targetPath);

                console.log(`Moved ${file} to ${year}-${month}/`);
            }
        }

        console.log('Organization complete!');
    }
}

// Usage
(async () => {
    const organizer = new FileOrganizer('./downloads');
    await organizer.organizeByExtension();
    // or
    // await organizer.organizeByDate();
})();
```

---

## Best Practices

✅ **Use async operations** except for initialization
✅ **Use streams** for large files
✅ **Always handle errors** with try-catch or .catch()
✅ **Close file descriptors** when done
✅ **Use path module** for cross-platform paths
✅ **Validate file paths** before operations
✅ **Set proper file permissions**
✅ **Use fs.promises** for cleaner async code

---

## Common Pitfalls

❌ Using sync methods in servers
❌ Not handling errors
❌ Hardcoding file paths
❌ Reading entire large files into memory
❌ Not closing file streams
❌ Ignoring file permissions

---

## Key Takeaways

✅ Use `fs` module for file system operations
✅ Prefer async operations for better performance
✅ Use streams for large files
✅ `path` module ensures cross-platform compatibility
✅ Always handle errors properly
✅ File watching enables real-time monitoring

---

## What's Next?

In the next lesson, we'll master asynchronous JavaScript patterns including callbacks, promises, and async/await.

**Next:** [Lesson 6: Asynchronous JavaScript](./06-async-javascript.md)

---

## Additional Resources

- [Node.js fs Documentation](https://nodejs.org/api/fs.html)
- [Node.js path Documentation](https://nodejs.org/api/path.html)
- [Node.js Streams Guide](https://nodejs.org/api/stream.html)
