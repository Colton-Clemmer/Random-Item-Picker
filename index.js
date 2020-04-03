var prompt = require('prompt')
var jsonfile = require('jsonfile')
var _ = require('lodash')

let pie
try {
pie = jsonfile.readFileSync('./pie.dat')
} catch { pie = { things: [] } }

const spin = () => {
    var a = []
    _.each(pie.things, (t) => {
        if (t.disabled) return
        _.times(t.wieght, () => a.push(t.name))
    })
    var choice = a[parseInt(Math.random() * a.length)]
    console.log(`\n\n\n\n\n
**************************
The Choice is:
    ${choice}

************************** 
`)
    loop()
}

const print = () => {
    console.log('\n\n\n\n\nThings:')
    let i = 0
    _.each(pie.things, (t) => {
        i++
        console.log(`${i}: ${t.name} - ${t.wieght}`)
    })
} 

const editMenu = () => {
    console.log(`\n\n\n\n\n
*************************
    Edit
*************************

1. Edit Existing
2. Add New
3. Delete
4. Save Changes
5. Main Menu
`)
    prompt.get(['selection'], (err, result) => {
        if (err) return
        switch(parseInt(result.selection))
        {
            case 1:
                getEdit()
                break
            case 2:
                addNew()
                break
            case 3:
                deleteItem()
                break
            case 4:
                saveChanges()
                break
            case 5:
                loop()
                break
            default:
                editMenu()
                break
        }
    })
}

const getEdit = () => {
    print()
    prompt.get(['selection'], (err, result) => {
        var selection = parseInt(result.selection)
        if (err) return
        if (!selection || selection > pie.things.length) {
            editMenu()
            return
        }
        editExisting(selection)
    })
}

const editExisting = (index) => {
    if (!index || index > pie.things.length) return
    var thing = pie.things[index - 1]
    printItem(thing)
    prompt.get(['Name', 'Wieght'], (err, results) => {
        if (err) return
        if (results.Name) pie.things[index - 1].name = results.Name
        if (results.Wieght) pie.things[index - 1].wieght = results.Wieght
        printItem(pie.things[index - 1])
        editMenu()
    })
}

const printItem = (item) => {
    console.log(`
\n\n\n\n\n
**************

Name: ${item.name}
Wieght: ${item.wieght}

**************
`)
}

const addNew = () => {
    let thing
    prompt.get(['Name', 'Wieght'], (err, results) => {
        if (err) return
        thing = {
            name: results.Name,
            wieght: results.Wieght
        }
        printItem(thing)
        pie.things.push(thing)
        editMenu()
    })
}

const deleteItem = () => {
    console.log(`\n\n\n\n
********************
    Delete
********************
`)
    print()
    prompt.get(['selection'], (err, result) => {
        var selection = parseInt(result.selection)
        if (err) return
        if (!selection || selection > pie.things.length) {
            editMenu()
            return
        }
        pie.things.splice(selection - 1, 1)
        console.log('\n\n\n\n\nThing Deleted')
        editMenu()
    })
}

const saveChanges = () => {
    console.log('\n\n\n\n\nSaving....')
    jsonfile.writeFileSync('./pie.dat', pie)
    console.log('Data Saved!')
    editMenu()
}

const changeItem = (disable) => {
    print()
    prompt.get(['selection'], (err, result) => {
        if (err) return
        var num = parseInt(result.selection)
        if (!num || num < 1 || num > pie.things.length) {
            loop()
            return
        }
        pie.things[num - 1].disabled = disable
        loop()
    })
}

const loop = () => {
    console.log(`\n\n\n\n\n
************************
    Wheel of Randomness
************************

${_.reduce(pie.things, (s, t) => `${s}- ${t.disabled ? 'XXX [' + t.name + ']': t.name}\n`, '')}

1. Edit things
2. Spin wheel
3. Disable Item
4. Enable Item
5. Quit`)


    prompt.get(['selection'], (err, result) => {
        if (err) return
        switch (parseInt(result.selection))
        {
            case 1:
                editMenu()
                break
            case 2:
                spin()
                break
            case 3:
                changeItem(true)
                break
            case 4:
                changeItem(false)
                break
            case 5:
                process.exit(1)
            default:
                loop()
        }
    })
}

loop()