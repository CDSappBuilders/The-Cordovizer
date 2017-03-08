/*jshint  esnext: true, node: true, jquery: true, devel: true */
/*globals nw, exec, path, progrSs, fse, xmlParser, marked */

//Get main window object
var curWin = nw.Window.get();

//Be sure of main window size when openning
curWin.on('loaded', () => {
    curWin.resizeTo(800, 500);
    console.log('opened');
    //Check for online status
    onl.check();
});

/**
 * Globals
 */
var curWDir, WwwDir, dirN, v, addedPlug, addedPlats, docPlatform, opendWin, line;

/**
 * Slowly but surely removing jquery by little functions here      ///////////////////////////////
 * We will use very short names hope you've got a good editor...  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

/**
 * Containing all 'remove jQuery' functions
 *
 * @type       {object}
 */
var nojq = {
    /**
     * Fill Content function = fc Didn't say it would be easy !!
     *
     * @param      {string}     el      The element to fill !css
     * @param      {string}     html    The html
     * @param      {function}   cb      A function in case you need do something after html things
     */
    fc: (el, html, cb) => {
        //Get element
        var cont = document.querySelector(el);

        //fill element
        cont.innerHTML = html;

        //cb
        if (cb) {
            cb();
        }
    },

    /**
     * Shorcut for event handlers
     *
     * @param      {string}     elementId  The element identifier
     * @param      {string}     evt        The event
     * @param      {function}   handler    The handler
     */
    evhl: (elementId, evt, handler) => {
        if (elementId) {
            //get elem and set handler in one phrase
            document.querySelector(elementId).addEventListener(evt, handler);
        }
    },

    /**
     * { function_description }
     *
     * @param      string       el           The element to create
     * @param      string       appendIn     The element to append in
     * @param      string       setId        The setting element ID
     * @param      string       setClass     The setting of class
     * @param      string       setClass2    The setting of a second class
     * @param      string       content      The content of the new element
     * @param      string       event        The event to listen
     * @param      function     eventHandle  The event handler
     */
    ce: (el, appendIn, setId = '', setClass = [''], content, event, eventHandle) => {
        //element to create
        var elem = document.createElement(el);

        //append to his new beloved parent
        document.querySelector(appendIn).appendChild(elem);

        //set ID if provided
        if (setId) {
            elem.id = setId;
        }

        //set class
        //TODO: make a for array loop maybe foreach
        //with this:  {
        //              someFn(arr[i]);
        //           }


        if (setClass != ['']) {
            for (var i = 0; i < setClass.length; i++) {
                elem.classList.add(setClass[i]);
            }
        }

        /**set class2
        if (setClass2 != '') {
            elem.classList.remove(setClass);
            elem.classList.add(setClass, setClass2);
        }*/

        //set content
        if (content) {
            elem.innerHTML = content;
        }


        //set events things
        if (event || eventHandle) {
            var elId = ` #${elem.id} `;
            nojq.evhl(elId, event, eventHandle);
        }
    },

    /**
     * Get and set value
     *
     * @param      string  el      CSS selector mandatory ID
     * @param      string  val     The value to set if provided, to get if not
     * @return     string  value   The value of selected element
     */
    v: (el, val) => { //TODO: not working
        //get elem
        var elem = document.querySelector(el);
        
        //do the thing quickly
        if (val) {

            elem.value = val;

        } else {

            return elem.value;

        }
    },

    at: (el, attr, atVal) => {
        //get elem
        var elem = document.querySelector(el);
        
        //do the thing
        if (atVal) {

            elem.setAttribute(attr, atVal);

        } else {
            var getAtVal = elem.getAttribute(attr);
            return getAtVal;

        }
    }
};
//nojq end

/**
 *Setting main content event handlers
 */

//Minimize button
nojq.evhl('#miniM', 'click', () => { curWin.minimize(); });

//Maximise button
nojq.evhl('#fullS', 'click', () => {
    //another data attr for the header to check if window is maximised
    var dataMax = $('header').attr('data-max');

    if (dataMax == 0) {
        curWin.maximize();
        $('header').attr('data-max', 1);
    } else {
        curWin.restore();
        $('header').attr('data-max', 0);
    }
});

//Close button
nojq.evhl('#closeW', 'click', () => { curWin.close(); });

/**
 * Setting nav event handlers
 * ID's speaking for themselves
 */
nojq.evhl('#projects-page', 'click', () => { selectOl('#projects-page', chooseProject); });
nojq.evhl('#create-page', 'click', () => { selectOl('#create-page', createProj.drop); });
nojq.evhl('#plugins-page', 'click', () => {
    selectOl('#core-plugins-page', pl.page);
    $('#core-plugins-page, #thpty-plugins-page').slideToggle();
    $('#plugins-page').hide();
});
nojq.evhl('#core-plugins-page', 'click', () => { selectOl('#core-plugins-page', pl.page); });
nojq.evhl('#thpty-plugins-page', 'click', () => { selectOl('#thpty-plugins-page', pl.thptyPage); });
nojq.evhl('#platforms-page', 'click', () => { selectOl('#platforms-page', plat.checkPlat); });
nojq.evhl('#configxml-page', 'click', () => { selectOl('#configxml-page', cfxml.page); });
nojq.evhl('#run-page', 'click', () => { selectOl('#run-page', runProject.page); });
nojq.evhl('#build-page', 'click', () => { selectOl('#build-page', bld.page); });

//test buttons
//test evhl
nojq.evhl('#but', 'click', () => {
    var c = Array.from('yepapi');
    console.log(c);
});

/**
 *Navigation
 */

/**
 * Function to highlight selected ol-child
 * jQuery removed***
 * 
 * //TODO: Try foreach will be better
 *
 * @param      {String}    whichOne  The element selector
 * @param      {Function}  pageFn    The function that displays the correspondant view
 */
function selectOl(whichOne, pageFn) {
    //get element for removing
    var nolc = document.querySelector('.nav-ol-child');

    //remove class
    nolc.classList.remove('nav-ol-selected');

    //get element for adding
    var nolcS = document.querySelector(whichOne);

    //add class
    nolcS.classList.add('nav-ol-selected');

    //Display page
    pageFn();
}

/**
 * Object to contain create project
 *
 * @type       {Object}     
 */
var createProj = {};
//Drag Drop user code folder: this is the first view

/**
 * Function first view: user could drop a folder containing web code
 * or create a hellocordova project to start from scratch
 *
 * 
 */
createProj.drop = () => {

    /**
     * Fill main-content
     */
    nojq.fc('#main-content', `   
        <input id="user-www-input-file" title="Pick a folder" type="file" nwdirectory="">
        <div id="pickWwwFold"><bold>Pick your code folder</bold><br>
        <small>.html .js .css</small></div>
        `);

    //set header content
    if (document.querySelector('header').innerHTML != curWDir) {
        //fill header when no project selected
        nojq.fc('header', `Meet the Cordovizer`);
    }

    //action when folder is dropped
    //nojq way
    nojq.evhl('#user-www-input-file', 'change', () => {
        //get user code folder path,
        //
        var a = nojq.v('#user-www-input-file');
        //messageBox.comeon(a);

        //parse the path to get supposed name of the app
        var appN = path.parse(a);

        //make it global
        WwwDir = a;

        //make the name global
        dirN = appN.name;

        //display the page
        createProj.page();
    });

    //Create blank button 
    nojq.ce('div',
        '#main-content',
        'create-blank-button', ['pluginDivChidren'],
        'Create blank project',
        'click',
        () => {
            //display the page
            createProj.page();
        });
};

/**
 * TODO...
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
createProj.page = () => {

    //empty content !!!!!! modified!!
    nojq.fc('#main-content', `<div id="create-page-name-div" class="pluginDiv">Name
        <br>
        <input id="create-page-name-input" type="text" placeholder="Sets the name of your app" class="inputWidth">
    </div>
    <div id="create-page-ID-div" class="pluginDiv">ID
        <br>
        <input id="create-page-app-id-input" type="text" placeholder="io.you.yourapp" class="inputWidth">
    </div>
    <div id="create-page-folder-div" class="pluginDiv">Folder
        <br>
        <input id="create-page-folder-name-input" type="text" placeholder="Sets the folder name of your app" class="inputWidth">
    </div>
    <div id="pickFold" class="pluginDiv">Output folder
        <br>
        <input id="create-page-output-folder-input" type="text" style="width:70%;" placeholder="Sets the location of your app">
        <div class="pluginDivChidren" id="browse">Browse</div>
        <input id="user-project-destination-input-file" title=" " type="file" nwdirectory="">
    </div>
    <div id="create-button" class="pluginDivChidren">Create</div>
    <div style="margin: 50px 0px 0px 5px; width: auto;">This will create the default "hellocordova" app</div>`);

    /**
     * Event handler for input file
     */
    nojq.evhl('#user-project-destination-input-file', 'change', () => {
        $('#create-page-output-folder-input')
            .val($('#user-project-destination-input-file').val());
    });

    /**
     * Event handler for create button
     */
    nojq.evhl('#create-button', 'click', () => {
        setTimeout(createProj.action(), 3000);
        progrSs.strt();
    });

    /**
     * Sets input values with folder name
     */
    $('#create-page-name-input, #create-page-folder-name-input').val(dirN);
    if (dirN) { //rien a faire la
        $('#create-page-app-id-input').val(`com.app.${dirN}`);
    }

    /**
     * button and input to trigger input file remanes jQ for now
     */
    $('#browse, #create-page-output-folder-input').click(() => {
        $('#user-project-destination-input-file').click();
    });
};

//do the thing
createProj.action = () => {

    //
    var pth = $('#user-project-destination-input-file').val(), //p
        name = $('#create-page-name-input').val(), //n
        lru = $('#create-page-app-id-input').val(),
        fold = $('#create-page-folder-name-input').val(), //f
        wwwPth = WwwDir; //www

    //messageBox.comeon(path);

    //execFile for create
    var newChProc_Create = execFile;

    //go for it
    newChProc_Create(`cordova.cmd`, [`create`, `${fold}`, `${lru}`, `${name}`], {
        cwd: pth
    }, (error, stdout) => {

        //check if user provided a www folder to avoid supressing it in the created app
        if (WwwDir) {
            //replace cordova default www folder by user's
            createProj.changeWww(pth, fold, wwwPth, name);

            //record this in ./user/projects.json file
            createProj.projectsJson(pth, name);
        }

        //check for error
        if (error) {

            messageBox.comeon(error);

            progrSs.good(() => {});

        } else { //send the action
            //handle header
            curWDir = `${pth}\\${fold}`;

            //Fill it
            nojq.fc('header', curWDir);

            //record this in ./user/projects.json file
            createProj.projectsJson(`${pth}\\${fold}`, name);

            //create config.json
            //this function is in app.js
            xml(`${pth}\\${fold}\\config.xml`, `${pth}\\${fold}\\config.json`);

            //end progress bar
            progrSs.good(() => {
                //send user to plugin page
                pl.page();
            });

            //let the user know that's done
            messageBox.comeon(`done bebe`);
        }
    });
};

//Replace www folder by user code folder
createProj.changeWww = (p, f, www, n) => {

    //get project path and set it to cwd
    var cordoPath = `${p}\\${f}`;
    var wwPath = www;
    curWDir = cordoPath;

    //indicate cwd in header
    //
    nojq.fc('header', cordoPath);

    //replacement append here
    fse.remove(`${cordoPath}\\www`, (err) => {
        if (err) { console.error(err); }
        //messageBox.comeon('successfully deleted www in cor proj!');
        fse.copy(wwPath, `${cordoPath}\\www`, (err) => {
            if (err) { console.error(err); }
            //messageBox.comeon('successfully overrode the www fold!');
        });
    });
};

//Update ./user/projects.json
//This is the index file where all created projects main data are stocked
//used to set curWdir
createProj.projectsJson = (foldPath, n) => {
    //create or update json file for user projects index
    fse.readJson('././user/projects.json', (err, projets) => {
        if (err) { console.log(err); }
        //date of creation for ./user/projects.json
        var d = new Date(),
            j = d.getDate(),
            m = d.getMonth() + 1,
            a = d.getFullYear(),
            h = d.getHours(),
            mn = d.getMinutes(),
            s = d.getSeconds(),
            dat = `${j}/${m}/${a}`,
            heur = `${h}:${mn}:${s}`;

        projets[n] = {
            path: `${foldPath}`,
            name: n,
            date: dat,
            heure: heur
        };

        //messageBox.comeon(projets);
        //write proj.json
        fse.writeJson('././user/projects.json', projets, () => {
            //messageBox.comeon(`${projets[n]} writed`);
        });
    });
};

//create blank project
//

//Choose a project for CWD
const chooseProject = () => {
    //empty content
    nojq.fc('#main-content', '');


    //read the file containing projects data
    fse.readJson('././user/projects.json',
        (err, obj) => {

            //display data in a div for each project
            //for(let [key, value] of Object.entries(obj))
            for (let [key, value] of Object.entries(obj)) {

                /**
                 * Create a div for each project in projects.json
                 */
                nojq.ce('div',
                    '#main-content',
                    key,
                    ['projects-page-base-div'],
                    key,
                    'click',
                    () => {
                        curWDir = value.path;
                        //Fill header with nojq.fc( )
                        nojq.fc('header', curWDir);

                        //Change color on select
                        $('.div-proj-selected').removeClass('div-proj-selected');
                        $(`#${key}`).addClass('div-proj-selected');
                        $('header').attr('data-k', key);
                        //messageBox.comeon(curWDir);
                    });

                /**
                 * Display project info
                 */
                nojq.ce('div',
                    `#${key}`,
                    '',
                    ['projects-page-base-div-data-container'],
                    `${value.date}<br>${value.heure}`);

                /**
                 * Path div
                 */
                nojq.ce('div',
                    `#${key} .projects-page-base-div-data-container`,
                    '',
                    ['projects-page-base-divOptPath'],
                    `${value.path}`);
            }

            //check for selected proj when user comes again
            var dataK = nojq.at('header', 'data-k');

            //signal selected proj by :hover color
            if (dataK) {
                //$().addClass();
                document.getElementById(`${dataK}`).classList.add('div-proj-selected');
            }
        });
};

//
//Plugin add start
var pl = {};

//add native plug
pl.page = () => {
    //empty content
    nojq.fc('#main-content', '');

    //get already installed plugins in cwd
    fse.readdir(`${curWDir}\\plugins`, (err, files) => {
        addedPlug = files;

        //make a div for each plugin avaible offline
        fse.readdir('./user/cordova_plugins', (err, files) => {
            $.each(files, (index, value) => {
                $('<div/>', {
                    id: value,
                    html: value,
                    'class': 'pluginDiv'
                }).appendTo('#main-content');

                //the usual option container
                $('<div/>', {
                    'class': 'div-opt-container'
                }).appendTo(`#${value}`);

                //get plugin version
                fse.readJson(`./user/cordova_plugins/${value}/package.json`, (err, obj) => {
                    v = obj.version;
                    $('<div/>', {
                        id: `${value}-${v}`,
                        html: `<span class="v">v <span class="vers">${v}`,
                        'class': 'verDiv'
                    }).appendTo(`#${value} .div-opt-container`);
                });

                //make the documentation button
                $('<div/>', {
                    id: `${value}_plugDoc`,
                    text: 'read the doc',
                    'class': 'pluginDivChidren',
                    click: () => {

                        //dislay the docs in new window this function is on line 456
                        md.readWriteInNewWin(`./user/cordova_plugins/${value}/README.md`, './new_window_open/cre.html');
                    }
                }).appendTo(`#${value} .div-opt-container`);

                //button to add plugin to the project
                $('<div/>', {
                    id: `${value}_plugAdd`,
                    text: 'Add plugin',
                    'class': 'pluginDivChidren',
                    'data-added': 0,
                    click: () => {

                        //check if a project is selected
                        if (curWDir === undefined) { messageBox.comeon('Please select a project or create a new one'); } else {
                            var dtad = $(`#${value}_plugAdd`).attr('data-added');
                            if (dtad == 0) {
                                setTimeout(pl.addPlug(value, './user/cordova_plugins'), 5000);
                                progrSs.strt();
                            } else {
                                setTimeout(pl.removePlug(value), 5000);
                                progrSs.strt();
                            }
                        }
                        //messageBox.comeon(addedPlug);
                    }
                }).appendTo(`#${value} .div-opt-container`);

                //check for already installed plugins
                var isAdded = $.inArray(value, addedPlug);
                if (isAdded === -1) {
                    //messageBox.comeon(`${value} pas la`);messageBox.comeon($.inArray(value, addedPlug));
                } //todo: make it a function to reuse after plugAdd
                else {
                    pl.afterAddPlu(value);
                }
            });
        });
    });
};

pl.thptyPage = () => {
    //clear view
    //empty content
    nojq.fc('#main-content', '');

    //and set content
    /**
     *Add plugin by name when online = true
     */
    $('<div/>', {
        id: 'add-thrd-plug',
        'class': 'pluginDiv'
    }).appendTo('#main-content');

    //put input in precedent div
    $('<input>', {
        css: {
            width: '70%'
        }
    }).appendTo('#add-thrd-plug');

    //put button to add
    $('<div/>', {
            id: 'add-thrd-plug-butt',
            text: 'Add plugin',
            'class': 'pluginDivChidren div-opt-container',
            'data-added': 0,
            css: {
                position: 'relative',
                top: '2.6vh'
            }
        }).appendTo('#add-thrd-plug')
        //here we go for function add third party plugin
        .click(() => {
            //Store var for template string
            //var trdPlugToAdd = $('#add-thrd-plug input').val(); 

            //check input value
            if ($('#add-thrd-plug input').val() === '') {
                messageBox.comeon('Please indicate a plugin to add.');
            } else {
                //check curwdir
                if (curWDir === undefined) {
                    messageBox.comeon('Please select a project or create a new one')
                } else {
                    //progress
                    progrSs.strt();

                    //execs
                    var newChProcAddPlugThrdStore = execFile;
                    var newChProcAddPlugThrdAdd = execFile;
                    var inputVal = $('#add-thrd-plug input').val();

                    //go for exec
                    //put plugin in plugin_container
                    newChProcAddPlugThrdStore(`cordova.cmd`, [`plugin`, `add`, `--save`, $('#add-thrd-plug input').val()], {
                        cwd: './user/plugin_container'
                    }, (error, stdout, stderr) => { //callback

                        //error
                        if (error) { console.log(error); }

                        //else
                        else {
                            //prompt user
                            messageBox.comeon(`Plugin ${inputVal} added for offline use`);

                            //put plugin in project
                            newChProcAddPlugThrdAdd(`cordova.cmd`, [`plugin`, `add`, `--save`, $('#add-thrd-plug input').val()], {
                                cwd: curWDir
                            }, (error, stdout, stderr) => {
                                //error    
                                if (error) { console.log(error); } else {
                                    messageBox.comeon(`Plugin ${inputVal} added in ${curWDir}`);
                                    progrSs.good(() => {});
                                }
                            });
                        }
                    });
                }
            }
        }); //end add trd plug button

    /**
     *Search plugin
     */

    //Open cordova plugin search page in browser
    $('<div/>', {
        id: 'cordo-plugin-browser-win',
        'class': 'pluginDiv',
        html: `Search in <span class="orange">http://cordova.apache.org/plugins</span><br>
                <small>This will open in your defautl browser</small>`
    }).appendTo('#main-content');

    //div option contain
    $('<div/>', {
        id: 'thpty-opt-cont',
        'class': 'div-opt-container'
    }).appendTo('#cordo-plugin-browser-win');

    //button browse in precedent div
    $('<div/>', {
        id: 'cordo-plugin-browser-win-butt',
        'class': 'pluginDivChidren',
        html: 'Browse',
        click: () => {
            //new window
            var browseWin = nw.Shell.openExternal('http://cordova.apache.org/plugins');
        }
    }).appendTo('#thpty-opt-cont');

    //div just for title
    $('<div/>', {
        'class': 'pluginDiv',
        html: 'Installed plugins for offline install',
        css: {
            'text-align': 'center'
        }
    }).appendTo('#main-content');

    //div to contain existing third pty plug make it scrollable and content not
    $('<div/>', {
        id: 'exist-thrdplug-div'
    }).appendTo('#main-content');

    //look for existing ones
    //TODOmake it a function to reload div after adding new plug from 
    fse.readdir('./user/plugin_container/plugins', (error, files) => {
        //console.log(files);
        $.each(files, (i, v) => {
            //avoid displaying fetch.json
            if (v != 'fetch.json') {
                $('<div/>', {
                    id: v,
                    'class': 'pluginDiv',
                    html: v
                }).appendTo('#exist-thrdplug-div');

                //opt container
                $('<div/>', {
                    'class': 'div-opt-container'
                }).appendTo(`#${v}`);

                //read the doc button
                $('<div/>', {
                    id: `${v}_plugDoc`,
                    text: 'read the doc',
                    'class': 'pluginDivChidren',
                    click: () => {

                        //dislay the docs in new window this function is on line 456
                        md.readWriteInNewWin(`./user/plugin_container/plugins/${v}/README.md`, './new_window_open/cre.html');
                    }
                }).appendTo(`#${v} .div-opt-container`);

                //add button
                $('<div/>', {
                    id: `${v}_plugAdd`,
                    text: 'Add plugin',
                    'class': 'pluginDivChidren',
                    'data-added': 0,
                    click: () => {
                        //check if a project is selected
                        if (curWDir === undefined) { messageBox.comeon('Please select a project or create a new one'); } else {
                            var dtad = $(`#${v}_plugAdd`).attr('data-added');
                            if (dtad == 0) {
                                setTimeout(pl.addPlug(v, './user/plugin_container/plugins'), 5000);
                                progrSs.strt();
                            } else {
                                setTimeout(pl.removePlug(v), 5000);
                                progrSs.strt();
                            }
                        }
                    }
                }).appendTo(`#${v} .div-opt-container`);

                //check for already installed plugins
                var isAdded = $.inArray(v, addedPlug);
                if (isAdded === -1) {
                    //messageBox.comeon(`${value} pas la`);messageBox.comeon($.inArray(value, addedPlug));
                } //todo: make it a function to reuse after plugAdd
                else {
                    pl.afterAddPlu(v);
                }
            } //end if  
        });
    });
};

//add plugin        
pl.addPlug = (val, shPath) => {

    //declaring C_P under different name in order to test kill of processes
    var newChProcAddPlug = execFile;

    //exec
    newChProcAddPlug(`cordova.cmd`, [`plugin`, `add`, `--save`, `${val}`, `--searchpath`, shPath], {
        cwd: curWDir
    }, (error, stdout, stderr) => {
        if (error) {
            messageBox.comeon(`${error} fail to add plugin`);
            progrSs.good(() => {
                //
            });
        } else {
            messageBox.comeon(`${val} added in ${curWDir} and console says :
                                ${stdout}
            `);
            progrSs.good(() => {
                pl.afterAddPlu(val);
                fse.readdir(`${curWDir}\\plugins`, (err, files) => {
                    addedPlug = files;
                });
            });
        }
    });
};
pl.removePlug = (val) => {

    //messageBox.comeon(hFol);

    //execFile for remove plugin
    var newChProc_RmPlug = execFile;

    //and so on
    newChProc_RmPlug(`cordova.cmd`, [`plugin`, `rm`, `--save`, `${val}`], {
        cwd: curWDir
    }, (error, stdout, stderr) => {

        if (error) {
            messageBox.comeon(`${val} fail to remove plugin with error: ${error}`);
        } else {
            messageBox.comeon(`${val} removed from ${curWDir} and console says : ${stdout}`);
        }

        progrSs.good(() => {});

        $(`#${val}_plugAdd`).attr('data-added', 0);
        $(`#${val}`).removeClass('div-proj-selected');

        //fc to fill that, it's a test
        nojq.fc(`#${val}_plugAdd`, 'Add plugin');

        fse.readdir(`${curWDir}\\plugins`, (err, files) => {
            addedPlug = files;
        });
    });
};

//sets button and signal plugin is here
pl.afterAddPlu = (a) => {
    $(`#${a}`).addClass('div-proj-selected');
    $(`#${a}_plugAdd`).attr('data-added', 1);

    //test fc again
    nojq.fc(`#${a}_plugAdd`, 'Remove');
};

/**
 *Run Emulate
 */
var runProject = {};

runProject.page = () => {

    //check if a project is selected
    if (curWDir === undefined) { messageBox.comeon('Please select a project or create a new one'); } else {
        //empty content
        nojq.fc('#main-content', '');

        //get existing platforms with userProject/platforms/platforms.json and make a div with $.each
        fse.readJson(`${curWDir}\\platforms\\platforms.json`, (err, plats) => {
            if (err) { messageBox.comeon(err); } else {
                $.each(plats, (platform, version) => {

                    //create the div 
                    $('<div/>', {
                        id: platform,
                        html: platform,
                        'class': 'pluginDiv'
                    }).appendTo('#main-content');

                    //the usual container
                    $('<div/>', {
                        'class': 'div-opt-container'
                    }).appendTo(`#${platform}`);

                    //append the run button in div
                    $('<div/>', {
                        text: 'Run',
                        'class': 'pluginDivChidren',
                        //here is the running thing
                        click: () => {
                            runProject.run(platform);
                        }
                    }).appendTo(`#${platform} .div-opt-container`);

                });
            }
        });
    } //else

};

//function
runProject.action = (platform) => {
    //set false end to progress bar
    setTimeout(progrSs.good(() => {}), 20000);

    //Run the app on device or emulator 
    //execFile...
    var newChProc_Run = execFile;

    //...
    newChProc_Run(`cordova.cmd`, [`run`, `${platform}`], { cwd: curWDir }, (error, stderr, stdout) => {
        if (error) {
            messageBox.comeon(`Cordova says: ${error}.  This means that you don't fulfill all requirements to run your project for this platform`);
            progrSs.good(() => {});
        } else {
            messageBox.comeon(`running and saying: ${stdout}`);
            progrSs.good(() => {


            });
        }
    });
};

//run the above function with progress bar
runProject.run = (pl) => {

    //launch function after progress bar started
    setTimeout(runProject.action(pl), 5000);

    //starting progress bar
    progrSs.strt();

    //appending new toggle button 
    //TODO: Please check if there is one existing
    //if (existing) {don't display it !!}
    //
    //okay let's put another data attr to the header
    //done!
    var dataTog = $('header').attr('data-togbutt');
    if (dataTog == 0) {

        //put the button
        runProject.togButt(pl);

        //set header attr
        $('header').attr('data-togbutt', 1);
    } else {
        //do nothing please
    }
};

//function to reduce window, put it on top of all others, and display run again button.
runProject.reduceCurWin = (cb) => {

    //set width
    curWin.resizeTo(50, 130);

    //set on top
    //TODO: button to toggle that
    curWin.setAlwaysOnTop(true);

    //handle header
    //empty it
    nojq.fc('header', '');

    //enhance it
    $('header').css('height', '30px');

    //Add data attr  (ramdomly choose the header to handle this task)
    $('header').attr('data-runbutt', 1);

    //put everything else under the ground
    $(`#main-content, nav, #messBox`).css({
        'z-index': '-10000',
        opacity: 0
    });

    //hide option container
    $('#window-option-container').hide();

    //making a cb just in case
    cb();

};

//append new buttons to remote window
runProject.appendNewButton = (platform) => {

    //TODO: add minimize button too !! please...

    //put a div to contain toggle and minimize
    $('<div/>', {
        id: 'toggled-win-command-container',
        css: {
            position: 'absolute',
            width: '50px',
            'z-index': 100000,
            left: '95px',
            top: '11px',
            '-webkit-app-region': 'no-drag'
        }
    }).appendTo('header');

    //create div to contain remote button 
    $('<div/>', {
        id: 'remmote-window-container'
    }).appendTo('app');

    //adding minimize button
    $('<div/>', {
        id: 'remmote-window-minimize',
        html: `
        <svg class="svg-window-buttons" viewBox="0 0 100 100" width="15" height="15" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <line id="mini-line" x1="15" y1="80" x2="85" y2="80" stroke-width="20" stroke="black" />
        </svg>
        `,
        css: { display: 'inline-block' }
    }).click(() => {
        curWin.minimize();
    }).appendTo('#toggled-win-command-container');

    //add button to toggle to normal window
    $('<div/>', {
        id: 'remmote-window-toggle',
        html: `
        <svg class="svg-window-buttons" viewBox="0 0 100 100" width="15" height="15" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <line id="fulls-line" x1="15" y1="20" x2="85" y2="20" stroke-width="20" stroke="black" />
            <path id="fulls-path" d="M 15 10 L 15 90 H 85 V 10" stroke="black" stroke-width="5" fill="none"/>
        </svg>
        `,
        css: { display: 'inline-block' }
    }).click(() => {

        //remove buttons
        $('#remmote-window-container').remove();

        //put window to original size
        curWin.resizeTo(800, 500);

        //re-fill header
        nojq.fc('header', curWDir)

        //header resize
        $('header').css('height', '6vh');

        //re-put everything on top
        $(`#main-content, nav, #window-option-container`).css({
            'z-index': '1',
            opacity: 1
        });

        //give back the window a little hummility
        curWin.setAlwaysOnTop(false);

        //hide option container
        $('#window-option-container').show();

    }).appendTo('#toggled-win-command-container');

    //run again button
    $('<div/>', {
        id: 'run-again-button',
        'class': 'pluginDivChidren remote-butt',
        text: 'Run',
        css: {
            top: '35px'
        }
    }).click(() => {
        console.log('run again clicked');

        //Run the app on device or emulator 
        //here to kill process if needed.. it seems so!

        //var execF..
        var newChProc_RunAgain = execFile;

        //go for new running
        newChProc_RunAgain(`cordova.cmd`, [`run`, `${platform}`], { cwd: curWDir }, (error, stderr, stdout) => {
            if (error) {
                messageBox.comeon(`Cordova says: ${error}.  This means that you don't fulfill all requirements to run your project for this platform`);
                progrSs.good(() => {});
            } else {
                messageBox.comeon(`running and saying: ${stdout}`);
                progrSs.good(() => {});
            }
        });
    }).appendTo('#remmote-window-container');

    //open devtools/#devices
    //(only working when builded with NWJS SDK Flavor)
    //
    $('<div/>', {
        id: 'devtools-button',
        text: 'Devtools',
        'class': 'pluginDivChidren remote-butt',
        css: {
            top: '75px'
        }
    }).click(() => {

        nw.Window.open(`chrome://inspect/#devices/`, {
            width: 700,
            height: 400
        });

    }).appendTo('#remmote-window-container');
};

//append the button to the current window to toggle it to little
runProject.togButt = (platform) => {
    //append button to toggle to little window remote button run again
    $('<div/>', {
        id: 'toggle-remote-button',
        'class': 'pluginDivChidren',
        text: 'Toggle to remote window',
        click: () => {

            //reduce window with the button to run again
            runProject.reduceCurWin(() => {

                //append div button when reducing
                runProject.appendNewButton(platform);

            });
        }
    }).appendTo('#ol');
};

/**
 *Platform
 */
var plat = {};
plat.platform = {
    android: 'android',
    blackberry10: 'Blackberry 10',
    ios: 'iOS',
    osx: 'OS X',
    ubuntu: 'Ubuntu',
    windows: 'Windows 8'
};

plat.checkPlat = () => {

    //check for platforms in project directory
    //TODO: check the same but with /platforms.json
    fse.readdir(`${curWDir}\\platforms`, (err, files) => {
        addedPlats = files;
        console.log(addedPlats);
        //messageBox.comeon(`${curWDir}\\platforms`);


        /**
        //check for platform requirements
        //HAVE TO CHANGE THIS WILL TRY NO REQUIREMENTS JUST BUILD FOR ONE LATFORM AT A TIME

        $.each(files, (i, v) => {
            if (v==='platforms.json') {}
            else {
                exec(  `cordova requirements ${v} `, {cwd:curWDir}, (error, stderr, stdout) => {
                    if (error) {
                        messageBox.comeon(error);
                        console.log(error);
                        }
                    else {
                        messageBox.comeon(stdout + stderr);
                        console.log(stdout + stderr);
                    }
                }); 
            }
        });
        */

        //display the platform main page
        plat.menu();
    });
};

//this is it
plat.menu = () => {

    //empty content
    nojq.fc('#main-content', '');

    //make div for each avaible platform
    $.each(plat.platform, (key, value) => {

        //recup doc folder et read files        
        fse.readdir(`./user/cordova_platforms/${key}`, (error, files) => {
            docPlatform = files;
            //messageBox.comeon(files);

            //displaying doc files name
            $.each(files, (k, v) => {
                $('<div/>', {
                    id: `${k}_doc`,
                    'class': 'platDocMenuItem',
                    text: v,
                    //Put parsed md doc file into new window
                    click: () => {
                        md.readWriteInNewWin(`./user/cordova_platforms/${key}/${v}`, `./new_window_open/recre.html`);
                    }
                }).appendTo(`#${key}_platDoc_menu`);
            });
        });

        //making a div for each platform avaible
        $('<div/>', {
            id: `${key}`,
            text: `${value}`,
            'class': 'pluginDiv'
        }).appendTo('#main-content');

        //appending a div to the precedent to put it on 'float right'
        $('<div/>', {
            'class': 'div-opt-container'
        }).appendTo(`#${key}`);

        //appending documentation button
        $('<div/>', {
            id: `${key}_platDoc`,
            text: 'read the doc',
            'class': 'pluginDivChidren',
            click: () => {

                /**slide down menu with doc files not everything is working
                 *because I suppose that marked refuse to parse large files
                 *this is the case for android platform 'index.md' which is obviously huge regarding
                 *the others doc md files sizes
                 */
                $(`#${key}_platDoc_menu`).slideToggle();
            }
        }).appendTo(`#${key} .div-opt-container`);

        //div containing doc menu
        $('<div/>', {
            id: `${key}_platDoc_menu`,
            'class': 'platDocMenu'
        }).appendTo(`#${key}_platDoc`).hide();

        //and finally 'add platform' button
        $('<div/>', {
            id: `${key}_platAdd`,
            text: 'Add platform',
            'class': 'pluginDivChidren',
            'data-added': 0,
            click: () => {

                //check if a project is selected
                if (curWDir === undefined) { messageBox.comeon('Please select a project or create a new one'); } else {
                    var dtad = $(`#${key}_platAdd`).attr('data-added');
                    if (dtad == 0) {
                        setTimeout(plat.add(key), 5000);
                        progrSs.strt();
                    } else {
                        setTimeout(plat.rm(key), 5000);

                        //start progbar
                        progrSs.strt();
                    }
                }
                //messageBox.comeon(addedPlats);
            }
        }).appendTo(`#${key} .div-opt-container`);

        //check for installed platforms
        var addeds = $.inArray(key, addedPlats);
        if (addeds === -1) {
            //messageBox.comeon(`${value} pas la ${addeds}`);
        } else { //messageBox.comeon(`${value} isHere`);
            plat.btnChange(key);
        }
    });
};

//'add platform function'
plat.add = (a) => {
    //execF add plat
    var newChProc_AddPlatform = execFile;

    //do it
    newChProc_AddPlatform(`cordova.cmd`, [`platform`, `add`, `${a}`, `--save`], { cwd: curWDir }, (error, stderr, stdout) => {
        if (error) {
            messageBox.comeon(`-${error}`);
            progrSs.good(() => {});
        } else {
            messageBox.comeon(`You successfully added ${a} to your cordova project ${stdout}`);

            //stop progress bar
            progrSs.good(() => {});

            //change button style and text to 'add' or 'remove'
            plat.btnChange(a);
        }
    });
};

//Remove platform at list trying to !!
plat.rm = (a) => {
    //execFile remove plat
    var newChProc_RemovePlat = execFile;

    newChProc_RemovePlat(`cordova.cmd`, [`platform`, `rm`, `${a}`, `--save`], { cwd: curWDir }, (error, stderr, stdout) => {
        if (error) {
            messageBox.comeon(`-${error}`);
            progrSs.good(() => {});
        } else {
            messageBox.comeon(`You successfully removed ${a} from your cordova project ${stdout}`);

            //stop progress bar
            progrSs.good(() => {});

            //change button style and text to 'add' or 'remove'
            $(`#${a}`).css('border', '0px');
            $(`#${a}_platAdd`).attr('data-added', 0);
            nojq.fc(`#${a}_platAdd`, 'Add platform');

        }
    });
};

//function to start progress bar at good time
plat.page = () => {
    setTimeout(plat.add(), 5000);
    progrSs.strt();
};

//function to chage style when platform is here or just added
plat.btnChange = (a) => {
    $(`#${a}`).css('border', '2.555px solid blue');
    $(`#${a}_platAdd`).attr('data-added', 1);
    nojq.fc(`#${a}_platAdd`, 'Remove');
};

/**
Edit config.xml
*/
var cfxml = {};

//FrontEnd
cfxml.page = () => { //TODO: update config.json with new config.xml
    //empty content
    nojq.fc('#main-content', '');

    //check for selected project
    if (curWDir === undefined) {
        messageBox.comeon('Please select a project or create a new one');
    } else {
        //declaring config.xml to deal with
        const configXml = new Config(`${curWDir}\\config.xml`);

        //read config.json file 
        fse.readJson(`${curWDir}\\config.json`, (err, confJs) => {
            if (err) { messageBox.comeon(err); } else {
                //fill an object 
                cfxml.pJ = confJs;

                //create form
                $('<form/>', {
                    id: 'confXmlBeforeBuild'
                }).appendTo('#main-content');

                //create divs
                $.each(cfxml.layout, (k, v) => {
                    $('<div/>', {
                        id: k,
                        html: `${k}<br>`,
                        'class': 'pluginDiv cfxmlDiv'
                    }).appendTo('#confXmlBeforeBuild');
                }); //each

                //Fill divs
                //remove input by removing second class when needed
                $('#description, #author, #allowintent, #platform, #plugin, #preference').removeClass('cfxmlDiv');

                //sets inputs
                $('<input>', {}).appendTo('.cfxmlDiv');

                //Textarea for description
                $('<textarea/>', {}).appendTo('#description');

                //
                //apply values to inputs (from config.json)
                //
                $('#content input').val(cfxml.pJ.widget.content.attr.src).change(() => {
                    //messageBox.comeon($('#content input').val());
                    configXml.setContent($('#content input').val());
                });

                $('#name input').val(cfxml.pJ.widget.name).change(() => {
                    //messageBox.comeon($('#name input').val());
                    configXml.setName($('#name input').val());
                });

                $('#description textarea').val(cfxml.pJ.widget.description).change(() => {
                    configXml.setDescription($('#description textarea').val());
                });

                $('#id input').val(cfxml.pJ.widget.attr.id).change(() => {
                    configXml.setID($('#id input').val());
                });

                //TODO: clone on line 1545
                $('#version input').val(cfxml.pJ.widget.attr.version).change(() => {
                    //android version code
                    //get and split version number
                    var aVersSplited = $('#version input').val().split('.'),
                        major = parseInt(aVersSplited[0]),
                        minor = parseInt(aVersSplited[1]),
                        patch = parseInt(aVersSplited[2]);

                    //set avc
                    $('#androidversionCode input').val(major * 1000 + minor * 10 + patch).change(() => {
                        //messageBox.comeon($('#androidversionCode input').val());
                        //messageBox.comeon(typeof (parseInt($('#androidversionCode input').val())));

                    });

                    configXml.setVersion($('#version input').val());
                });

                //access
                $('#access input').val(cfxml.pJ.widget.access.attr.origin).change(() => {
                    configXml.setElement('access', { origin: $('#access input').val() });
                });

                //allow nav
                $('#allownavigation input').attr('placeholder', 'http://example.com/*').change(() => {
                    var an = $('#allownavigation input').val();
                    configXml.addRawXML(`<allow-navigation href="${an}" />`);
                });

                //allow-intent
                //Append warning not editable
                $('<div/>', {
                    html: 'No modification possible here, see plugin Whitelist documentation',
                    css: {
                        color: 'rgba(255, 177, 0, 0.96)'
                    }
                }).appendTo('#allowintent');

                //TODO: change function for each or remove all rewrite all ...?
                //set an option to add allow-intent
                $.each(cfxml.pJ.widget['allow-intent'], (i, v) => {
                    $('<input>', {
                        id: i,
                        value: v.attr.href
                    }).appendTo('#allowintent');
                }); //each allowIntent

                /**
                 *Preferences
                 */
                //here we try to deal with preferences
                $('<input>', {
                    id: 'pref-name',
                    placeholder: 'Name'
                }).appendTo('#preference');
                $('<input>', {
                    id: 'pref-value',
                    placeholder: 'Value'
                }).appendTo('#preference');

                //div to contain existing pref
                $('<div/>', {
                    id: 'exist-pref-div'
                }).appendTo('#preference');

                //Display existing config.json preferences 
                $.each(cfxml.pJ.widget['preference'], (key, value) => {
                    //messageBox.comeon(key);
                    //messageBox.comeon(value);
                    if ($.isArray(cfxml.pJ.widget['preference'])) {
                        //fill pref div
                        $('<div/>', {
                            id: `${value.attr.name}_pref`,
                            html: `${value.attr.name} <span class="vers">${value.attr.value}</span>`
                        }).appendTo('#exist-pref-div');

                        //fill pref obj
                        cfxml.pref[value.attr.name] = value.attr.value;
                    }
                    //TODO: recup json to put in object ...
                    else {
                        $('<div/>', {
                            id: `${key}_pref`,
                            html: `${value.name} <span class="vers">${value.value}</span>`
                        }).appendTo('#exist-pref-div');
                        cfxml.pref[value.name] = value.value;
                    }
                });

                //button to save pref 
                $('<div/>', {
                    id: 'cfxml-save-pref-button',
                    'class': 'pluginDivChidren',
                    html: 'Save',
                    click: () => {
                        //fill the object
                        cfxml.pref[$('#pref-name').val()] = $('#pref-value').val();

                        //write the file right here
                        configXml.write(() => {
                            console.log(cfxml.pref);

                            //empty inputs for a new round
                            $('#pref-name').val('');
                            $('#pref-value').val('');

                            //TODO: add out put to show already setted preferences maybe modifying node mod function

                            //pass the info to config.json
                            //this function is in app.js
                            xml(`${curWDir}\\config.xml`, `${curWDir}\\config.json`);
                        });
                    }
                }).appendTo('#preference');
                //preferences end
                //

                /**
                 *Author
                 */
                //TODO: make a 'save' button and nearly same behavior as preferences below
                $('<div/>', { id: 'authorItems' }).appendTo('#author');
                $('<span/>', {
                    text: 'Name'
                }).appendTo('#authorItems');
                $('<input>', { id: 'authName', value: cfxml.pJ.widget.author.inXml }).appendTo('#authorItems');
                $('<span/>', {
                    text: 'Mail'
                }).appendTo('#authorItems');
                $('<input>', { id: 'authMail', value: cfxml.pJ.widget.author.attr.email }).appendTo('#authorItems');
                $('<span/>', {
                    text: 'Website'
                }).appendTo('#authorItems');
                $('<input>', { id: 'authWebS', value: cfxml.pJ.widget.author.attr.href }).appendTo('#authorItems');

                /**
                 *android version code value
                 */
                //get and split version number
                var aVersSplited = $('#version input').val().split('.'),
                    major = parseInt(aVersSplited[0]),
                    minor = parseInt(aVersSplited[1]),
                    patch = parseInt(aVersSplited[2]);

                //set avc for input val
                $('#androidversionCode input').val(major * 1000 + minor * 10 + patch).change(() => {
                    //messageBox.comeon($('#androidversionCode input').val());
                    //messageBox.comeon(typeof (parseInt($('#androidversionCode input').val())));
                    configXml.setAndroidVersionCode(parseInt($('#androidversionCode input').val()));
                });

                /*
                 *platform
                 */
                $.each(cfxml.pJ.widget.platform, (k, v) => {
                    //messageBox.comeon(k);
                    //messageBox.comeon(v);
                    $('<div/>', {
                        id: v.attr.name,
                        html: `${v.attr.name}`
                    }).appendTo('#platform');

                    /** not very good! have to check if multiple entrys instead of checking for ios
                     * isArray?
                     */
                    if (v.attr.name === 'ios') {
                        $.each(v['allow-intent'], (i, val) => {
                            //messageBox.comeon(i);
                            //messageBox.comeon(val);
                            $('<input>', {
                                id: `${k}_inputios`,
                                value: val.attr.href
                            }).appendTo(`#${v.attr.name}`);
                        });
                    }


                    $('<input>', {
                        id: `${k}_input`,
                        value: v['allow-intent'].attr.href
                    }).appendTo(`#${v.attr.name}`);

                    /**
                     *plugins************
                     */

                    //Create container div
                    $('<div/>', {
                        id: 'exist-plug-div'
                    }).appendTo('#plugin');

                    //Fill the div
                    $.each(cfxml.pJ.widget['plugin'], (key, value) => {
                        //messageBox.comeon(key);
                        //messageBox.comeon(value);
                        if ($.isArray(cfxml.pJ.widget['plugin'])) {
                            $('<div/>', {
                                id: `${value.attr.name}_plug`,
                                html: `${value.attr.name} <span class="vers">${value.attr.spec}</span>`
                            }).appendTo('#exist-plug-div');
                        } else {
                            $('<div/>', {
                                id: `${key}_plug`,
                                html: `${value.name} <span class="vers">${value.spec}</span>`
                            }).appendTo('#exist-plug-div');
                        }
                    });
                });
            } //else readJson
        });

        //valid button
        $('<div/>', {
            'class': `cfxml-valid-button`,
            html: `Done`,
            click: () => { //write the file
                configXml.setAuthor($('#authName').val(), $('#authMail').val(), $('#authWebS').val());

                //setPreference
                $.each(cfxml.pref, (n, v) => {
                    configXml.setPreference(n, v);
                });


                configXml.write(() => {
                    messageBox.comeon('ok cliked');
                    //create config.json in order to work with config.wml
                    //this function is in app.js, has said before..
                    xml(`${curWDir}\\config.xml`, `${curWDir}\\config.json`);
                });
            }
        }).appendTo('#main-content');
    } //else 
};

//object to store pref
cfxml.pref = {};

//parsed json filled by config.json object
cfxml.pJ

cfxml.layout = {
    author: {
        name: '',
        email: '',
        website: ''
    },
    name: '',
    content: '',
    id: '',
    description: '',
    preference: '',
    version: '',
    androidversionCode: '',
    access: '',
    allowintent: '',
    allownavigation: '',
    platform: '',
    plugin: ''
};

/**
 *Build (it's about time!!!)
 */

//build fn object
var bld = {};

//y Vamos
bld.page = () => {
    //empty content
    nojq.fc('#main-content', `
        <div class="pluginDiv" style="text-align: center;">Android build options</div>
        <div id="build-unsign-div" class="pluginDiv">Build unsigned
            <div class="div-opt-container">
                <div id="build-unsign-deb" class="pluginDivChidren">Build debug</div>
                <div id="build-unsign-rel" class="pluginDivChidren">Build release</div>
            </div>
        </div>
        <!-- Build signed div -->
        <div id="build-sign-div" class="pluginDiv">Build signed
            <div id="build-sign-existingK-div"></div>
            <div id="build-sign-inputs-div">
                <input id="build-sign-Kstore-path-inp-file" type="file" nwdirectory="" require="true">
                <input id="build-sign-Kstore-path-inp" placeholder="Path to existing keystore" require="true">
                <input id="build-sign-KS-pass-input" placeholder="Keystore password">
                <input id="build-sign-Kalias-input" placeholder="Alias">
                <input id="build-sign-K-pass-input" placeholder="Key password">
            </div>
            <div class="div-opt-container">
                <div id="build-sign-button" class="pluginDivChidren">Build</div>
            </div>
    </div>`);

    /**
     * Build debug unsigned project //TODO: not tested yet and make a function with it for all builds
     */
    nojq.evhl('#build-unsign-deb', 'click', () =>{ 
        //get the process
        var newChProc_Build_uns_deb = execFile;

        //and do it
        newChProc_Build_uns_deb('cordova.cmd', ['build', 'android', '--debug'], { cwd: curWDir },
            (error, stderr, stdout) => {

                console.log(error);
                console.log(stdout);
                console.log(stderr);

        });
    });

    /**
     * build release unsigned //TODO: not tested yet
     */
    nojq.evhl('#build-unsign-rel', 'click', () =>{ 
        //get the process
        var newChProc_Build_uns_rel = execFile;

        //and do it
        newChProc_Build_uns_rel('cordova.cmd', ['build', 'android', '--release'], { cwd: curWDir },
            (error, stderr, stdout) => {

                console.log(error);
                console.log(stdout);
                console.log(stderr);

        });
    });

    /**
     *Build signed //validation required here as in other forms //to check
     */
    //event handler
    nojq.evhl('#build-sign-button', 'click', () => {
        //get path input
        var ph = nojq.v('#build-sign-Kstore-path-inp');

        //get keystore password
        var ksp = nojq.v('#build-sign-KS-pass-input');

        //get alias input
        var al = nojq.v('#build-sign-Kalias-input');

        //get key pass
        var kp = nojq.v('#build-sign-K-pass-input');
        //exec
        var newChProc_Build = execFile;

        newChProc_Build('cordova.cmd', ['build', 'android', '--release', '--', `--keystore=${ph}`, `--storePassword=${ksp}`, `--alias=${al}`, `--password=${kp}`], { cwd: curWDir },
            (error, stderr, stdout) => {

                console.log(error);
                console.log(stdout);
                console.log(stderr);

        });
    });

    //fill the existingK div
    fse.readJson('./user/keys/allkeys.json', (e, exK) => {
        if (e) { console.log(e); } else {

            /** Example
             *  let myObject = {first: "one"};
             *
             *  for(let [k, v] of Object.entries(exK)) {
             *  console.log(key, value); // "first", "one"
             *  }
             */

            for (let [k, v] of Object.entries(exK)) {
                //console.log(k, v);
                //create div for each stored key
                nojq.ce('div',
                    '#build-sign-existingK-div',
                    k, ['pluginDiv-child', 'projects-page-base-div'],
                    k,
                    'click',
                    () => {
                        //set path input
                        nojq.v('#build-sign-Kstore-path-inp', `${v.Path}\\${k}`);


                        //set keystore password
                        nojq.v('#build-sign-KS-pass-input', `${v.Password}`);

                        //set alias input
                        nojq.v('#build-sign-Kalias-input', `${v.Alias}`);

                        //set key pass
                        nojq.v('#build-sign-K-pass-input', `${v.PasswordKey}`);
                    });

                //append path
                nojq.ce('div',
                    `#${k}`,
                    `${k}-opt`,
                    ['div-opt-container', 'orange'],
                    `${v.Path}`);
            }
        }
    });

    /**
     *Create key with java Keytool
     */
    //data in ./user/keys/lastkey.json

    //Create keystore div
    $('<div/>', {
        id: 'sign-div',
        'class': 'pluginDiv',
        html: 'Create keystore'
    }).appendTo('#main-content');

    //Dname div
    $('<div/>', {
        id: 'sign-div-dname-container',
        css: {
            border: '1px solid black'
        }
    }).appendTo('#sign-div');

    //Fill it with inputs
    //get data
    fse.readJson('./user/keys/lastkey.json', (e, kjs) => {
        if (e) {
            console.log(e); 
        } else {
            //handle dname 
            for (let [k, v] of Object.entries(kjs.dname)) {
                //console.log(k, v)
                    //sets div with label and input
                $('<div/>', {
                    id: `${k}_DN`
                }).appendTo('#sign-div-dname-container');

                $('<label/>', {
                    'for': k,
                    html: k
                }).appendTo(`#${k}_DN`);

                $('<input>', {
                        id: `${k}_DN-input`,
                        name: k,
                        placeholder: k,
                        value: v,
                        css: {
                            'margin-top': '4px'
                        }
                    }).appendTo(`#${k}_DN`)
                    .change(() => {
                        kjs.dname[k] = $(`#${k}_DN-input`).val();

                        //test write file
                        fse.writeJson('./user/keys/lastkey.json', kjs);
                    });
            } //);

            //get dname values into variables to make them optional
            var cn  = $('#Name_DN-input').val(),
                o   = $('#Organization_DN-input').val(),
                ou  = $('#Unit_DN-input').val(),
                l   = $('#Town_DN-input').val(),
                c   = $('#Country_DN-input').val(),
                s   = $('#State_DN-input').val();

            //Make this a unique string
            var DName = `cn=${cn}, o=${o}, ou=${ou}, l=${l}, s=${s}, c=${c}`;

            //container for others
            $('<div/>', {
                id: 'sign-div-ks-container',
                css: {
                    border: '1px solid black'
                }
            }).appendTo('#sign-div');

            //handle others
            for (let [k, v] of Object.entries(kjs)) {
                //exit dname
                if (k != 'dname') {

                    //Container for inputs below
                    $('<div/>', {
                        id: k
                    }).appendTo('#sign-div-ks-container');

                    //inputs
                    $('<input>', {
                            id: `${k}-input`,
                            placeholder: k,
                            value: v
                        }).appendTo(`#sign-div-ks-container #${k}`)
                        .change(() => {
                            kjs[k] = $(`#${k}-input`).val();

                            //write file
                            fse.writeJson('./user/keys/lastkey.json', kjs);
                        });
                }
            }

            //customize inputs
            //Path
            //open file input (temporary before adding button)
            $('#Path-input').click(() => {
                $('#keystore-destination-input-file').click();
            });

            //sets hidden input file
            $('<input>', {
                    id: 'keystore-destination-input-file',
                    title: ' ',
                    type: 'file',
                    nwdirectory: ''
                }).appendTo('#main-content')
                .change(() => {
                    //transfer value to input text 'Path'
                    $('#Path-input').val($('#keystore-destination-input-file').val());

                    //update key.json
                    kjs.Path = $('#keystore-destination-input-file').val();

                    //write file
                    fse.writeJson('./user/keys/lastkey.json', kjs);
                });

            //validity input
            $('#Validity-input').remove();

            $('<input>', {
                    id: 'Validity-number-input',
                    type: 'number'
                }).appendTo('#Validity').val(kjs.Validity)
                .change(() => {
                    kjs.Validity = $('#Validity-number-input').val();

                    //write file
                    fse.writeJson('./user/keys/lastkey.json', kjs);
                });

            //the usual option container
            $('<div/>', {
                'class': 'div-opt-container'
            }).appendTo('#sign-div');

            //Button sign
            $('<div/>', {
                    id: 'sign-div-button',
                    'class': 'pluginDivChidren',
                    html: 'Create'
                }).appendTo('#sign-div .div-opt-container')
                .click(() => {
                    //prog bar
                    progrSs.strt();

                    //delay progress
                    setTimeout(() => {
                        //set path to add ks name
                        var Path = $('#Path-input').val(),
                            Nm = $('#KSname-input').val(),
                            PathKs = `${Path}\\${Nm}.keystore`;

                        //execFile
                        var newChProc_Key = execFile;

                        //and do it...\keytool.exe
                        //TODO: make this an input to choose or a research with fse and get the good path here 
                        //because environement variable path is tricky with keytool, in my config at least
                        newChProc_Key(`C:\\Program Files\\Android\\Android Studio\\jre\\jre\\bin\\keytool.exe`, ['-genkeypair', '-dname', DName, '-keystore', PathKs, '-alias', $('#Alias-input').val(), '-storepass', $('#Password-input').val(), '-keypass', $('#PasswordKey-input').val(), '-validity', $('#Validity-number-input').val()], (error, stdout, stderr) => {
                            if (error) {
                                console.log(error);
                                console.log(stderr);
                            } else {
                                //get allkeys.json obj
                                fse.readJson('./user/keys/allkeys.json', (err, objK) => {
                                    if (err) { console.log(err); } else {
                                        //get info to put inside
                                        var n = Nm;

                                        //sets object to write
                                        objK[n] = kjs;

                                        //and write
                                        fse.writeJson('./user/keys/allkeys.json', objK);

                                        //stop pr bar
                                        setTimeout(() => {
                                            progrSs.good(() => {
                                                messageBox.comeon(`You successfully created a new keystore:<br>
                                            Name: ${Nm}<br> in: ${Path}`);
                                            })
                                        }, 1000);
                                    }
                                });
                            }
                        });
                    }, 2000);

                    //progress

                });
        }
    });
};



/**
 *Message Box to replace console logs
 */

//Message box object and so on...
const messageBox = {};

//this done, here we go
messageBox.comeon = (message) => {

    //check if window is littled by runProject function
    // 0 means that window is normal size
    var isRunning = $('header').attr('data-runbutt');
    if (isRunning == 0) {

        //empty message box 
        nojq.fc('#messBox', '');

        //and put it on top of all
        $('#messBox').css({
            'z-index': 1000,
            opacity: 1
        });

        //put the message in the box
        $('<div/>', {
            id: 'messBox_text',
            'class': 'messBox_text',
            html: message
        }).appendTo('#messBox');

        //add button to retoggle the box
        $('<div/>', {
            html: 'ok',
            'class': 'pluginDivChidren notSelect',
            click: () => {
                $('#messBox').fadeTo('slow', 0).css('z-index', '-10000');
            }
        }).appendTo('#messBox_text');

    } //end If

    //display message in new window when native is toggled to little
    else {
        fse.writeFile('./new_window_open/cre.html', `
            <!DOCTYPE html>
                <html>
                    <head>
                        <title>Message</title>
                    <link rel="stylesheet" href="app.css">
                    <body class="messBox_text" >
                        ${message}
                        <script src="jquery.js"></script>
                        <script src="./new_window_open/messWin.js"></script>
                    </body>
                </html>`, 'utf-8', () => {

            //openning new window
            var newWin = nw.Window.open('./new_window_open/cre.html', {
                id: 'newWindowMBox',
                'frame': false

                //resize function in the callback, this is temporary before setting 
                //an onload function to hide the window when loading
            }, (newWin) => {
                console.log('new win opened');
                newWin.setMaximumSize(600, 250);
            });
        });
    }
};


/**
 *Frameless window stuff goes just here
 */

//TODO: find a way to add draggable zone on devtools/#devices window and a close button-->will never happen sorry

//noFrame object is created here
//var noFrame = {};

//and here we go
//TODO: put click handler to div instead of svg
//sets divs for the buttons


//append svg's to previously created divs


/**
Markdown handler for docs and readme.md's
*/
var md = {};
md.readWriteInNewWin = (fileToRead, fileToWrite) => {
    fse.readFile(fileToRead, 'utf-8', (err, data) => {

        //messageBox.comeon(data);
        var redat = marked(data);
        //messageBox.comeon(redat);
        var readHtml = `<!DOCTYPE html>
                <html>
                    <head>
                        <title>Cordova GUI</title>
                    <link rel="stylesheet" href="./new_window_open/github.css">   
                    </head>
                <body>
                    ${redat}
                <style>
                    body{width:70vw; margin:auto;}
                    pre{background:rgba(180,180,180,0.35);padding:1vh;}
                </style>
                <script src="jquery.js"></script>
                <script src="tmpl.js"></script>
                <script src="app.js"></script>
                <div id ="suite" class ="lireLaSuite"><div/>
                </body>
                </html>`;
        fse.writeFile(fileToWrite, readHtml, 'utf-8', (error) => {
            nw.Window.open(fileToWrite);
        });

    });

};

//test to supply marked with large files
var htm = {};

htm.readHtmlFileNWinOpen = (fileToRead, fileToWrite, cb) => {
    fse.readFile(fileToRead, 'utf-8', (err, data) => {
        if (err) { messageBox.comeon(err); }

        //messageBox.comeon(data);
        var readHtml = `<!DOCTYPE html>
                <html>
                    <head>
                        <title>Cordova GUI</title>
                    <link rel="stylesheet" href="./new_window_open/github.css">   
                    </head>
                <body>
                    ${data}
                <style>
                    body{width:70vw; margin:auto;}
                    pre{background:rgba(180,180,180,0.35);padding:1vh;}
                </style>
                <script src="jquery.js"></script>
                <script src="tmpl.js"></script>
                <script src="app.js"></script>
                <div id ="suite" class ="lireLaSuite"><div/>
                </body>
                </html>`;

        fse.writeFile(fileToWrite, readHtml, 'utf-8', (error) => {
            if (error) { messageBox.comeon(error); }

            setTimeout(nw.Window.open(fileToWrite), 5000);
        });

        cb();
    });
};

/**
 *Online status indicator
 */
//object
var onl = {};

//fn
onl.check = () => {

    //fill line variable
    line = navigator.onLine;

    //sets content depending online status
    if (line === true) {
        //$('#online-status').html('Online').css('background', 'rgba(0, 255, 0, 0.8)');
        $('#window-option-container').css('border-bottom', '1px solid rgba(0, 255, 0, 0.8)');
    } else if (line === false) {
        //$('#online-status').html('Offline').css('background', 'rgba(255, 0, 0, 0.8)');
        $('#window-option-container').css('border-bottom', '1px solid rgba(255, 0, 0, 0.8)');
    }
};

//Checking for connexion every 2 seconds
setInterval(() => {
    onl.check();
    //console.log('setInt');
}, 2000);



/**
 * Former app.js with declarations of node_modules with their parameters when needed
 */

//Declarations
const path = require('path');
const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fse = require('fs-extra');
const marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    highlight: function(code, lang) {
        var highlighted;
        if (lang) {
            highlighted = hljs.highlight(lang, code, false);
        } else {
            highlighted = hljs.highlightAuto(code);
        }
        return highlighted.value;
    }
});
const hljs = require('highlight.js');
const xmljs = require('xml2js');
const xmlParser = new xmljs.Parser({
    explicitCharkey: false,
    trim: true,
    normalize: false,
    normalizeTags: false,
    attrkey: "attr",
    charkey: "inXml",
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: false,
    explicitRoot: true,
    validator: null,
    xmlns: false,
    explicitChildren: false,
    preserveChildrenOrder: false,
    childkey: '$$',
    charsAsChildren: false,
    includeWhiteChars: true,
    async: false,
    strict: true,
    attrNameProcessors: null,
    attrValueProcessors: null,
    tagNameProcessors: null,
    valueProcessors: null,
    rootName: 'root',
    xmldec: {
        'version': '1.0',
        'encoding': 'UTF-8',
        'standalone': true
    },
    doctype: null,
    renderOpts: {
        'pretty': true,
        'indent': '  ',
        'newline': '\n'
    },
    headless: false,
    chunkSize: 10000,
    emptyTag: '',
    cdata: false
});
const Config = require('cordova-config');
// Load and parse the config.xml 
//const configXml = new Config('config.xml');
// Write the config file 
//configXml.writeSync();


//First view
createProj.drop();

//prevent dragover 
$('nav').on('drop dragover', function(event) {
    event.preventDefault();
    return false;
});

//function xml2js
function xml(pathx, pathj) {
    fse.readFile(pathx, (err, data) => {
        xmlParser.parseString(data, (err, result) => {
            fse.writeJson(pathj, result, () => {
                console.log('config.json writed avec writeJson');
            });
            //console.dir(result.widget);
            console.log('done for xml');
        });
    });
}
