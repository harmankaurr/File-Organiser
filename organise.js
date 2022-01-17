let fs = require("fs")
let path = require("path")
let utility = require("./utility")


function checkWhetherFile(src){
    return fs.lstatSync(src).isFile()      
}


function getExtension(src){
    let ext = src.split(".").pop()
    return ext
}


function getCategory(ext){
    let types = utility.types
    for (let category in types) {
        for (let i = 0; i < types[category].length; i++) {
            if (ext == types[category][i]) {
                return category
            }
        }
    }
    return "others"
}


function sendFile(dest, category, src) {
    let categoryPath = path.join(dest, category)     
    if (fs.existsSync(categoryPath) == false) {       
        fs.mkdirSync(categoryPath)               
    }
    let fName = path.basename(src)            
    let cPath = path.join(categoryPath, fName)    
    fs.copyFileSync(src, cPath)                 
}


function getContent(src) {
    return fs.readdirSync(src)  
}

// MAIN FUNCTION
function organizer(src, dest) {
    if(checkWhetherFile(src) == true){   
        let ext = getExtension(src)       
        let category = getCategory(ext)    
        sendFile(dest, category, src)     
    }
    else{                               
        let childNames = getContent(src)    
        for (let i = 0; i < childNames.length; i++) {
            if (childNames[i] == "organized_files") {    
                continue;
            }
            let childPath = path.join(src, childNames[i])
            organizer(childPath, dest)            
        }
    }
}

let src = process.argv[2]||process.cwd()             
let dest = path.join(src,"organized_files")          
if (fs.existsSync(dest) == false){         
    fs.mkdirSync(dest)              
}

organizer(src,dest)