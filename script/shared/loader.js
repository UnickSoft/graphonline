// Global version needs to force reload scripts from server.
let globalVersion = 76;

var include = function(filename, localDir) {
    return {filename: filename, localDir: localDir};
};

class ModuleLoader {
    constructor(name) {
        this.loadingStack = [];
        this.startedLoading = new Set();
        this.loaded = new Set();
        this.isRunningSync = false;
        this.syncLoaded = [];
        this.cacheLoading = false;
        this.callsAfterCacheResolve = [];
    }

    getFullname = function (filename, localDir)
    {
        let versionParam = "";
        if (typeof globalVersion !== 'undefined') {	
            versionParam = "?v=" + globalVersion;
        }
        let localDirParam = "";
        if (typeof localDir !== 'undefined') {
            localDirParam = localDir;
        }
        return "/" + SiteDir + "script/" + localDirParam + filename + "?v=" + globalVersion;
    }

    isAllLoaded = function (includes) 
    {
        self = this;
        return includes.every((inc) => {
            return self.loaded.has(inc);
        });
    }

    load = function (fullFilename, checkQueue, sync) {  
        let self = this;

        let loadError = function()
        {
            console.error("Cannot load " + fullFilename);
            checkQueue();
        }
        let loadSuccess = function()
        {
            self.loaded.add(fullFilename);
            console.log(self.loaded.size + ". " + fullFilename);
            checkQueue();
        }

        if (this.loaded.has(fullFilename)) {
            this.isRunning = true;
            checkQueue();
            return;
        }

        var script = document.createElement('script');
        script.src = fullFilename;
        script.onload  = loadSuccess;
        script.onerror = loadError;
        document.head.appendChild(script);
        this.isRunning = true;
        if (sync) {
            this.syncLoaded.push(fullFilename);
        }
    }    

    loadFromQueue = function (checkQueue) {
        if (this.loadingStack.length == 0) {
            return;
        }

        let fullFilename = this.loadingStack.pop();
        this.load(fullFilename, checkQueue, true);
        this.isRunning = true;
    }

    // Load modules one by one in sync mode.
    // Call fullLoadedCallback when all modules loaded.
    doInclude = function (includes, fullLoadedCallback) {
        let self = this;

        if (this.cacheLoading) {
            this.callsAfterCacheResolve.push(
                    function() {
                        self.doInclude(includes, fullLoadedCallback);
                    }
                );
            return;
        }

        let checkQueue = function () {
            if (self.loadingStack.length != 0) {
                self.loadFromQueue(checkQueue);
                return;
            }

            self.isRunning = false;
            if (typeof fullLoadedCallback === 'undefined' || fullLoadedCallback === null) {
                return;
            }

            fullLoadedCallback();
        }

        let pushToQueue = function (fullFilename) {
            self.loadingStack.push(fullFilename)
            self.startedLoading.add(fullFilename);
        }

        let reversedIncludes = includes.reverse();

        reversedIncludes.forEach((inc) => {
            let fullFilename = self.getFullname(inc.filename, inc.localDir);
            if (self.startedLoading.has(fullFilename)) {
                return;
            }
            pushToQueue(fullFilename)
        });        

        if (!self.isRunning) {
            checkQueue();
        }
    }

    // Load modules async start load all modules.
    // Call fullLoadedCallback when all includes loaded.
    doIncludeAsync = function (includes, fullLoadedCallback) {
        let self = this;
        if (this.cacheLoading) {
            this.callsAfterCacheResolve.push(
                    function() {
                        self.doIncludeAsync(includes, fullLoadedCallback);
                    }
                );
            return;
        }
        
        let includesFull = [];

        let checkLoading = function () {
            self.isRunning = false;
            if (typeof fullLoadedCallback === 'undefined' || fullLoadedCallback === null) {
                return;
            }

            if (!self.isAllLoaded(includesFull)) {
                return;
            }

            fullLoadedCallback();
        }

        let pushToQueue = function (fullFilename) {
            self.load(fullFilename, checkLoading, false);
            self.startedLoading.add(fullFilename);
        }

        let reversedIncludes = includes.reverse();

        reversedIncludes.forEach((inc) => {
            let fullFilename = self.getFullname(inc.filename, inc.localDir);
            includesFull.push(fullFilename);
            if (self.startedLoading.has(fullFilename)) {
                return;
            }
            pushToQueue(fullFilename)
        });

        checkLoading();
    }

    beginCacheLoading = function (cachedFiles) {
        let self = this;
        cachedFiles.forEach((file) => {
            self.startedLoading.add(file);
            self.loaded.add(file);
        });
        this.cacheLoading = true;
    }

    endCacheLoading = function () {
        this.cacheLoading = false;
        this.callsAfterCacheResolve.forEach((func) => {
            func();
        });
    }
}

let moduleLoader = new ModuleLoader();

function doInclude(includes, callback) {
    moduleLoader.doInclude(includes, callback);
}

function doIncludeAsync(includes, callback) {
    moduleLoader.doIncludeAsync(includes, callback);
}
