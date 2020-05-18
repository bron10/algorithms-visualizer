
(function(window){
    const inputSize = document.getElementById('input-size');
    const linearSearch = document.getElementById('l-search');
    const binarySearch = document.getElementById('b-search');
    const selectionSort = document.getElementById('s-sort');
    const bubbleSort = document.getElementById('b-sort');
    const info = document.getElementById('info');
    const randomSet = document.getElementById('random-set');

    const canvasHeight = window.innerHeight- document.getElementById('operation-inputs').offsetHeight;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let blockWidth = 20;
    let blockSpace = 15;
    const algoSelector = document.getElementById('algo-type');
    let selectedAlgo = algoSelector.value;
    const defaultBlockColor = '#69E6FF';
    const visitedBlockColor = '#B5F3FF';
    const selectedBlockColor = 'orange';
    ctx.font='12px Arial';
    selectedAlgoOptions();
    algoSelector.addEventListener('change', algoChange);
    linearSearch.addEventListener('click', linearSearchAction)
    binarySearch.addEventListener('click', binarySearchAction)
    selectionSort.addEventListener('click', selectionSortAction)
    bubbleSort.addEventListener('click', bubbleSortAction)
    randomSet.addEventListener('click', selectRandomSet)
    inputSize.addEventListener('change', changeInputSize)
    
    /**
     * @param {*} e event 
     * @description change input size
     */
    function changeInputSize(e){
        const dataSetLength = e.target.value;
        let dataSet = [];
        dataSet.length = dataSetLength;
        createDataInput(dataSet) 
    }

    /**
     * @param {*} e event 
     * @description change Algorithm
     */
    function algoChange(e){
        selectedAlgo = e.target.value;
        selectedAlgoOptions();
    }

    /**
     * @param {*} e event 
     * @description Display operations inputs with selected algorithm
     */
    function selectedAlgoOptions(){
        const opSelector = document.getElementsByClassName('algo-ops');
        Array.from(opSelector).map((elem)=>{
            if(elem.id!==selectedAlgo+'-operations'){
                elem.setAttribute('style','display:none');
            }else{
                elem.setAttribute('style','display:block');
            }
        })
    }

    /**
     * @description create number of inputs according to dat size
     * @param {*} dataSet the whole data-set as array 
     */
    function createDataInput(dataSet){
        const datasetCollection = document.getElementById('dataset-collection');
        clearDatasetCollection(datasetCollection);
        for (let index = 0; index < dataSet.length; index++) {
            const createElement = document.createElement('input');
            createElement.setAttribute('type','number');
            createElement.setAttribute('class','data-input');
            const dataPresent = dataSet[index];
            if(dataPresent){
                createElement.setAttribute('value', dataPresent);
            }
            datasetCollection.appendChild(createElement);
        }
        const createButton = document.createElement('button');
        createButton.innerHTML = "Render your data";
        createButton.addEventListener('click', ()=>{
            validate();
            const dataInputs = getDataInputs();
            renderCanvas(dataInputs)
        })    
        datasetCollection.appendChild(createButton);
    }

    /**
     * @description clear data collection inputs before change or add of data size
     * @param {*} list  
     */
    function clearDatasetCollection(list){
        while (list.hasChildNodes()) {  
            list.removeChild(list.firstChild);
          }
    }

    /**
     * @description get the data from input fields
     */
    function getDataInputs(){
        return Array.from(document.getElementsByClassName('data-input')).map((elem)=>{
            return elem.value;
        })
    }

    /**
     * @description set canvas according to the size of data inputs.
     * @param {*} dataInputs 
     */
    function setCanvas(dataInputs){
        const canvas = document.getElementById("canvas");
        const width = (blockWidth*dataInputs.length)+(blockSpace*dataInputs.length);
        const margin = calculateMargin(width);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('style',`border:1px solid #d3d3d3;margin : 0 ${margin}px 20px ${margin}px`)
        canvas.setAttribute('width',width)
    }

    function calculateMargin(canvasWidth){
        return Math.ceil((window.innerWidth-canvasWidth-40)/2)
    }

    /**
     * @description select a random set of data
     */
    function selectRandomSet(){
        inputSize.value = 0;
        const arr = [];
        while(arr.length < 9){
            var r = Math.floor(Math.random() * canvasHeight) + 1;
            if(arr.indexOf(r) === -1) arr.push(r);
        };
        createDataInput(arr);    
    }

    /**
     * @description validate the data input
     */
    function validate(){
        const inputs =  getDataInputs()
        const enteredInputs = inputs.filter(ip=>!!ip)
        
        if(!inputs.length || inputs.length!==enteredInputs.length){
            alert('Please complete data input options');
            throw "Data inpput not complete";
        }
    }

    /**
     * @description validate search input for search algorigthms
     */
    function validateSearchIp(){
        let searchValue = parseInt(document.getElementById('search-data').value);
        const inputs =  getDataInputs();
        const match = inputs.filter(ip=>ip==searchValue)
        if(!match.length){
            alert('Search input doesnt matches the data values');
            throw "No match found";
        }
    }

    /**
     * @description binary search algo
     */
    function binarySearchAction(){
        validate();
        validateSearchIp();
        const dataInputs = getDataInputs().sort(function(a, b){return a - b});
        let minIndex = 0;
        let maxIndex = dataInputs.length-1;
        let medIndex = Math.floor((dataInputs.length)/2);
        
        binaryRender(minIndex, medIndex, maxIndex, dataInputs)
    }

    /**
     * @description rendering of components according to algo
     * @param {*} minIndex minimum index 
     * @param {*} medIndex selected middle index
     * @param {*} maxIndex maximum index
     * @param {*} dataInputs data for operation
     */
    function binaryRender(minIndex, medIndex, maxIndex, dataInputs){
        renderCanvas(dataInputs)
        let searchValue = parseInt(document.getElementById('search-data').value);
        medIndex = Math.floor((minIndex+maxIndex)/2)
        let step = blockWidth+blockSpace;
        let med = dataInputs[medIndex];
        let min = dataInputs[minIndex];
        let max = dataInputs[maxIndex];
        drawBlock(step*minIndex,0,blockWidth,min, selectedBlockColor)
        drawBlock(step*maxIndex,0,blockWidth,max, selectedBlockColor, max)
        drawBlock(step*medIndex,0,blockWidth,med, 'red')    
        if(med==searchValue){
            renderCanvas(dataInputs)
            drawBlock(step*medIndex,0,blockWidth,med, 'black')
            return;
        }else if(med < searchValue){
            minIndex = medIndex+1;
        }else{
            maxIndex = medIndex-1;  
        }
        setTimeout(()=>{
            binaryRender(minIndex, medIndex, maxIndex, dataInputs)
         },1000)
    }


    /**
     * @description get minimum fo remaining data set
     * @param {*} min default selected min
     * @param {*} counter counter to get next datum
     * @param {*} data current data
     */
    function getMinSelection(min, counter, data){
        let step = blockWidth+blockSpace;
        if(!data[counter+1]){
            info.innerHTML = '';
            return min;
        }
        
        if(parseInt(data[min])>parseInt(data[counter+1])){
            min =counter+1;
            info.innerHTML = info.innerHTML+`, Selected minimum : ${min}`;
        }
        return getMinSelection(min, ++counter, data)
    }

    /**
     * @description selection Sort animation
     * @param {*} index default index
     * @param {*} data current data
     */
    function selectionSortAnim(index, data){
        setTimeout(()=>{
            let len = data.length;
            let step = blockWidth+blockSpace;
            // info.innerHTML = `Interation ${index}`;
            if(index >= len){
                console.log("data", data);
                info.innerHTML = `Interations Complete`;
                return (index)
            }else{
                let counter = index; 
                let min =  getMinSelection(index,counter, data);
                info.innerHTML = `Interation ${index}`;
                if (min != index) {
                    swap(min, index, data)    
                }
                ++index;
                // requestAnimationFrame(()=>{
                    
                    
                selectionSortAnim(index,data)
                // })
                // requestAnimationFrame(()=>)
            }
            console.log("index", index);
        },1000*index)
    }

    /**
     * @description selection sort algorithm function
     */
    function selectionSortAction(){
        validate();
        
        let dataInputs = getDataInputs();
        renderCanvas(dataInputs);
        
        let index = 0;

        selectionSortAnim(index,dataInputs)
    } 

    /**
     * @description bubble sort algorithm function
     */
    function bubbleSortAction(){
        validate();
        let dataInputs = getDataInputs();
        renderCanvas(dataInputs);
        let len = dataInputs.length;

        let swapped;
        for(let j=0;j<len;j++){
            //setTimeout(()=>{
                swapped = false;
                    for (let i = 0; i < len-j; i++) {
    
                        // console.log("dataInputs[i] > dataInputs[i + 1]", dataInputs[i], dataInputs[i + 1], dataInputs[i]>dataInputs[i + 1])
                        let current = parseInt(dataInputs[i]);
                        let next =  parseInt(dataInputs[i + 1]);
                        console.log("current > next", current > next, current , next)
                        if (next && (current > next)) {
                            // let tmp = dataInputs[i];
                            // dataInputs[i] = dataInputs[i + 1];
                            // dataInputs[i + 1] = tmp;
                            dataInputs = swap(i+1, i,dataInputs)
                            // console.log("swapped--->", dataInputs[i], dataInputs[i+1])
                            swapped = true;
                        }
                    }
                if (swapped == false)
                    return;
                    // break;
                    
            //}, 1000*j)
        }
        console.log("dataInputs", dataInputs);
        return dataInputs;
    }

    /**
     * @description swap two data sets
     * @param {*} indexFrom data index to be replaced by 
     * @param {*} indexTo data index to be replaced with
     * @param {*} data actual data
     */
    function swap(indexFrom, indexTo, data){
        let step = blockWidth+blockSpace;

        clearBlock(step*indexTo, 0, blockWidth, calculateBlockheight(data[indexTo]), data[indexTo])
        clearBlock(step*indexFrom, 0, blockWidth, calculateBlockheight(data[indexFrom]), data[indexFrom])
        
        // ctx.translate(indexTo, 0)    
        
        let tmp = data[indexTo];
        data[indexTo] = data[indexFrom];
        drawBlock(step*indexTo,0,blockWidth,data[indexTo], selectedBlockColor)
        data[indexFrom] = tmp;
        drawBlock(step*indexFrom,0,blockWidth,data[indexFrom], selectedBlockColor)
        return data;
    }

    /**
     *@description linear search function
     */
    function linearSearchAction(){
        validate();
        validateSearchIp();
        let searchValue = document.getElementById('search-data').value;
        const dataInputs = getDataInputs();
        renderCanvas(dataInputs);
        let xcord = 0;
        let ycord = 0;
        let alreadyFound = false;
        for (let index = 0; index < dataInputs.length; index++) {
            setTimeout(function(){
                
                const dataValue = parseInt(dataInputs[index]);
                if(alreadyFound){
                    return;
                }
                
                if(dataValue==searchValue){
                    drawBlock(xcord,ycord,blockWidth,dataValue, selectedBlockColor)
                    alreadyFound = true;
                }
                
                if(dataValue!=searchValue){
                    drawBlock(xcord,ycord,blockWidth,dataValue, visitedBlockColor)
                }
                xcord = xcord+blockWidth+blockSpace;
            }, 500*index)
        }
    }

    /**
     * @description draw rectangle block text for animation
     * @param {*} dataValue data value for calculating height
     * @param {*} xcord x cordinate
     * @param {*} ycord y cordinate
     */
    function drawBlockText(dataValue, xcord, ycord){    
        ctx.fillText(dataValue, xcord+3,ycord+calculateBlockheight(dataValue)+10);
    }

    /**
     * @description clear retangle block for animation
     * @param {*} x cordinate 
     * @param {*} y cordinate
     * @param {*} width width of block 
     * @param {*} height height of a block
     */
    function clearBlock(x,y,width,height){
        ctx.clearRect(x,y,width,height+12)
    }

    /**
     * @description render canvas
     * @param {*} dataInputs set of inputs from input field 
     */
    function renderCanvas(dataInputs){
        
        setCanvas(dataInputs);
        let xcord = 0;
        let ycord = 0;
        for (let index = 0; index < dataInputs.length; index++) {
            const dataValue = parseInt(dataInputs[index]);    
            // ctx.fillRect(xcord,ycord,blockWidth,calculateBlockheight(dataValue));
            drawBlock(xcord,ycord,blockWidth,dataValue, defaultBlockColor)
            xcord = xcord+blockWidth+blockSpace;
        }
    }

    /**
     * @description draws rectangle block for animation
     * @param {*} xcord x cordinate 
     * @param {*} ycord y cordinate
     * @param {*} blockWidth width of rectangle block 
     * @param {*} val data value 
     * @param {*} color color to set set during animation
     */
    function drawBlock(xcord,ycord,blockWidth, val, color){
        ctx.beginPath();
        ctx.lineWidth = "10";
        ctx.fillStyle = color;
        ctx.rect(xcord,ycord,blockWidth, calculateBlockheight(val));
        ctx.fill();
        drawBlockText(val, xcord,ycord)
    }

    /**
     * @description utility function for handling data
     * @param {*} data 
     */
    function parseInt(data){
        try{
            data = JSON.parse(data)
        }catch(e){
            data = 0
        };
        return data;
    }

    /**
     * @description calculate block height with respect to canvas
     * @param {*} dataValue data value according to input
     */
    function calculateBlockheight(dataValue){
        return ((dataValue/canvasHeight)*canvasHeight)
    }
}(window))