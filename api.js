function* randomPageGenerator(min, max) {
  while (true) {
    yield Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const newPages = randomPageGenerator(1, 49);

const fbiChan = fetch(`https://api.fbi.gov/wanted/v1/list?page=${newPages.next().value}`);
const fbiChannel = fetch(`https://api.fbi.gov/wanted/v1/list?page=${newPages.next().value}`);

Promise
.all([fbiChan, fbiChannel])
.then((response) => {
  return Promise.all(response.map((res) => res.json()));
  }).then((data) => { 
  const [...lists] = data
  const [pageOne, pageTwo]  = lists
  let [...cases] = pageOne.items
  let [...crimes] = pageTwo.items 
  const conCat = (arr, addition) => arr.concat(addition);

  let casesTitle = cases.map((cases) => cases.title)
  let crimeTitle = crimes.map((crimes) => crimes.title)
  let allCaseTitles = conCat(casesTitle, crimeTitle)

  let caseUrl = cases.map((cases) => cases.url)
  let caseUrl2 = crimes.map((crimes) => crimes.url)
  const allCaseUrls = conCat(caseUrl, caseUrl2)
 
  let caseSubjects = cases.map((cases) => cases.subjects)
  let caseSubjects2 = crimes.map((crimes) => crimes.subjects)
  const allSubjects = conCat(caseSubjects, caseSubjects2)
  let totalCaseSubjects = allSubjects.flat()

  function Casecount(totalCaseSubjects) {      
  let frequency = {};
  for (let i = 0; i < totalCaseSubjects.length; i++) {
    let topic = totalCaseSubjects[i];
    frequency[topic] = (frequency[topic] || 0) + 1;
  }
    return frequency
  }

  let caseStats = Casecount(totalCaseSubjects);
  if (!localStorage.getItem('caseStats')) {
  localStorage.setItem('caseStats', JSON.stringify(caseStats)); 
  }  

  const listStat = document.getElementById("current-Collection");
  let allCaseStats = JSON.parse(localStorage.getItem('caseStats'));
    
  for (let key in allCaseStats) {
    const li = document.createElement('li');
    li.innerHTML = `${key}: ${allCaseStats[key]}`;
    listStat.appendChild(li);
  }

  let caseDetails = cases.map((cases) => cases.details)
  let caseDetails2 = crimes.map((crimes) => crimes.details)
  const allCaseDetails = conCat(caseDetails, caseDetails2)

  let caseDescription = cases.map((cases) => cases.description)
  let caseDescription2 = crimes.map((crimes) => crimes.description)
  const allcaseDescription = conCat(caseDescription, caseDescription2)
  
  let suspectIdentifier = cases.map((cases) => cases.scars_and_marks)
  let suspectIdentifier2 = crimes.map((crimes) => crimes.scars_and_marks)
  const allSuspectIdentifier = conCat(suspectIdentifier, suspectIdentifier2)

  let suspectCaution = cases.map((cases) => cases.caution)
  let suspectCaution2 = crimes.map((crimes) => crimes.caution)
  const allSuspectCaution = conCat(suspectCaution, suspectCaution2)

  let caseRemarks = cases.map((cases) => cases.remarks)
  let caseRemarks2 = crimes.map((crimes) => crimes.remarks)
  const allCaseRemarks = conCat(caseRemarks, caseRemarks2)

  let fieldOffice = cases.map((cases) => cases.field_offices)
  let fieldOffice2 = crimes.map((crimes) => crimes.field_offices)
  const allFieldOffices = conCat(fieldOffice, fieldOffice2)
  const totalFieldOffices = allFieldOffices.flatMap((allFieldOffices) => allFieldOffices)

  let infoReward = cases.map((cases) => cases.reward_text)
  let infoReward2 = crimes.map((crimes) => crimes.reward_text)
  const allInfoReward = conCat(infoReward, infoReward2)

  let warningOfSuspect = cases.map((cases) => cases.warning_message)
  let warningOfSuspect2 = crimes.map((crimes) => crimes.warning_message)
  const allWarnings = conCat(warningOfSuspect, warningOfSuspect2)

  let caseImage = cases.flatMap((cases) => cases.images)
  let crimeImage = crimes.flatMap((crimes) => crimes.images)

  let originalImage = caseImage.map((caseImage) => caseImage.original)
  let originalImage2 = crimeImage.map((crimeImage) => crimeImage.original)
  const allOriginalImages = conCat(originalImage, originalImage2)

  const caseImages = [];
  allOriginalImages.forEach((item) => {
    caseImages.push(item)
  });
  
  if (!localStorage.getItem('caseImages')) {
  localStorage.setItem('caseImages', JSON.stringify(caseImages)); 
  }

  let casePath = cases.map((cases) => cases.path)
  let crimePath =  crimes.map((crimes) => crimes.path)
  const allPaths = conCat(casePath, crimePath)

  const allFedCases = [];
  for (let i = 0; i < allCaseTitles.length; i++) {
  const obj = {
    caseTitle: allCaseTitles[i],
    originalImage: allOriginalImages[i],
    url: allCaseUrls[i],
    casePath: allPaths[i],
    caseSubject: allSubjects[i],
    description: allcaseDescription[i],
    identifiers: (allSuspectIdentifier[i]) ? allSuspectIdentifier[i] : 'None known',
    details: (allCaseDetails[i]) ? allCaseDetails[i] : 'N/A',
    caseRemarks: (allCaseRemarks[i]) ?  allCaseRemarks[i] : 'N/A',
    reward: (allInfoReward[i]) ? allInfoReward[i] : 'N/A',
    caution: (allSuspectCaution[i]) ? allSuspectCaution[i] : 'N/A',
    warning: (allWarnings[i]) ?   allWarnings[i] : 'N/A',
    office: (totalFieldOffices[i]) ? totalFieldOffices[i] :'All Field Offices' ,

  };

  allFedCases.push(obj);  
  allFedCases.sort((a, b) => a.caseTitle.localeCompare(b.caseTitle));
  }
  if (!localStorage.getItem('allFedCases')) {
  localStorage.setItem('allFedCases', JSON.stringify(allFedCases)); 
  }
  let totalCases = JSON.parse(localStorage.getItem('allFedCases'))
  let myList = document.getElementById("most-wanted");
  //let currentId = 1;
  totalCases.forEach((item) => {
      const div = document.createElement("div");
      let caseProfileImage = `https://www.fbi.gov${item.casePath}/@@images/image`
      div.innerHTML = `
      <div>
      <div class=close-fav>
      <button class='favsClose not-visible' data-closeOrFav="favs">&#9873;</button>
      <button class='favsClose not-visible' data-closeOrFav="close">&#x0058;</button>
      </div>
      <h2>${item.caseTitle}</h2>
      <div class='${item.casePath}'>
      <img class = 'case-cover-img' src=${caseProfileImage} />
      </div>
      <div class='case-meta'>
      <h3>Case Subject: ${item.caseSubject}</h3>
      <h3>Field office: ${item.office}</h3>
      </div>
      <div class='case-info'>Details: ${item.details}</div>
      <div class='case-info'>Description: ${item.description}</div>
      <p class='case-info'>Identifiers: ${item.identifiers}</p>
      <div class='case-info'>Case remarks: ${item.caseRemarks}</div>
      <div class='case-info'>Caution: ${item.caution}</div>
      <h4 class='case-info' id='reward'>Reward: ${item.reward}</h4>
      <h4 class='case-info' id='warning'>Warning: ${item.warning}</h4>
      <a class='case-info' id='tip' href="${item.url}" target='blank'>Submit an anonymous Tip online</a>
    
      <button id='info-container' class='caseOpener info-btn' data-moreInfo="moreInfo">More Info</button>
      </div>
      `;
      myList.appendChild(div);
      div.classList.add("case");
      //div.setAttribute("id", currentId++);
      div.setAttribute("id", item.casePath);
});

function setBackGround() {
  const allTheCases = document.getElementsByClassName('case');
  let alreadyStored = localStorage.getItem("favoriteCases");
  
  if (localStorage.getItem("favoriteCases") && (!localStorage.getItem("favoritesIsActive"))) {
    for (const cases of allTheCases) {
      if (alreadyStored.includes(cases.id)) {
        cases.classList.add('not-visible');
        cases.style.backgroundColor = 'red';
      } else {
        cases.style.backgroundColor = 'navy';
        cases.classList.remove('not-visible');
      }     
    }
  }

  if (localStorage.getItem("favoriteCases") && (localStorage.getItem("favoritesIsActive"))) {
    for (const cases of allTheCases) {
      if (!alreadyStored.includes(cases.id)) {
        cases.classList.add('not-visible');
        cases.style.backgroundColor = 'navy';
      } else {
        cases.style.backgroundColor = 'red';
        cases.classList.remove('not-visible');
      }
    }
  }

  if (!localStorage.getItem("favoriteCases") && (localStorage.getItem("favoritesIsActive"))) {

    const favorites = localStorage.getItem("favoritesIsActive") || "";

    const storageArr = favorites.split(',');
    const index = storageArr.indexOf('IsActive');
    if (index > -1) {
      storageArr.splice(index, 1);
      localStorage.setItem("favoritesIsActive", storageArr.join(','));
    }

    for (const cases of allTheCases) {
        cases.classList.remove('not-visible');
        cases.style.backgroundColor = 'navy';
    }
  }

} 

setBackGround()

function removeBackGround(id) {
  const allTheBox = document.getElementById(id); 
  allTheBox.style.backgroundColor = 'navy';
} 

function CloseModal(idNum) {
  const chosenButton = document.getElementsByClassName('favsClose')
  const chosenCase = document.getElementsByClassName('my-class')
 const crimeProfile = document.getElementById(idNum)
  const returnInfoBtn = crimeProfile.getElementsByClassName('caseOpener')
  for (const btn of returnInfoBtn){
      btn.classList.remove('not-visible')
  }
  for (const cases of chosenCase){
      cases.classList.remove('my-class')
      for (const item of chosenButton) {
        if (!item.classList.contains('not-visible')){
          item.classList.add('not-visible')
          cases.classList.remove('my-class')
      } 
    }
  }
}

const allInfoBtn = document.getElementsByClassName('caseOpener')
const caseOpen = document.getElementsByClassName('caseOpener')
for(const item of caseOpen) {
  item.addEventListener('click', function(event) {
    let parentNode = event.target.parentNode;
    let grandParentNode = parentNode.parentNode
    let openOptions = parentNode.getElementsByClassName('favsClose')
    for (const btn of openOptions) {
      btn.classList.remove('not-visible')
    }
    let profileId = event.target.parentNode.parentNode.id
    item.classList.add('not-visible')
    Array.from(allInfoBtn).forEach(element => {
      element.classList.add('not-visible');
    });
    grandParentNode.classList.add('my-class') 
    
    const currentCaseImage = document.getElementsByClassName('case-cover-img')   
    for (const pic of currentCaseImage) {
        pic.classList.add('not-visible')
    }
    let caseImages = JSON.parse(localStorage.getItem('caseImages'))
    caseImages.forEach((pic) => {
    if (pic.includes(profileId)) {
      const currentCaseImages = document.getElementsByClassName(profileId)
      const imageDiv =  currentCaseImages[0];
      const newImgElement = document.createElement('img')
      newImgElement.src = pic;
      imageDiv.appendChild(newImgElement);
      newImgElement.classList.add("other-images");
    }
  }  
  )}
  )};







document.addEventListener('click', function(event) {
  if (event.target.classList.contains('favsClose')) {
        let clickedBtn;
        let profileId = event.target.parentNode.parentNode.parentNode.id
          Array.from(allInfoBtn).forEach(element => {
            element.classList.remove('not-visible');
            const allTheCaseImage = document.getElementsByClassName('case-cover-img');
            const otherCaseImages = document.getElementsByClassName("other-images") 
            const currentCaseImages = document.getElementsByClassName(profileId)

            for (const otherPic of otherCaseImages) {              
              for (const currentPic of currentCaseImages) {
                  currentPic.removeChild(otherPic);
              } 
            }
          for (const pic of allTheCaseImage) {
            pic.classList.remove('not-visible')
        }
      });
      let caseOp = event.target.dataset
      Object.keys(caseOp).forEach(key => {
      clickedBtn = caseOp[key]
      clickedBtn === 'close' ? CloseModal(profileId) : addFavs(profileId)
    });
  }
});























function favoritePressed() {
  const allTheCases = document.getElementsByClassName('case');
  const OpenOptions = document.getElementsByClassName('favsClose');
  Array.from(allTheCases).forEach(file => {
    file.classList.remove('my-class');
  });
  Array.from(OpenOptions).forEach(file => {
    file.classList.add('not-visible');
  });
} 












function addFavs(idNum) {
  const favorites = localStorage.getItem("favoriteCases") || "";
  if (!favorites.includes(idNum)) {
    localStorage.setItem("favoriteCases", favorites + (favorites ? "," : "") + idNum);
  } else {
    const storageArr = favorites.split(',');
    const index = storageArr.indexOf(idNum);
    if (index > -1) {
      storageArr.splice(index, 1);
      localStorage.setItem("favoriteCases", storageArr.join(','));
      removeBackGround(idNum)
    }
  }
  favoritePressed()
  setBackGround()
};






const sortingCases = document.getElementById('sortCase');
sortingCases.addEventListener('click', function(){
    let domNodes = document.getElementsByClassName('case')
    let totalCases = JSON.parse(localStorage.getItem('allFedCases'));
    let myList = document.getElementById("most-wanted");
    totalCases.reverse();
    let sortedNodes = Array.from(domNodes).reverse();
    sortedNodes .forEach(item => {
    myList.appendChild(item);
    });
    localStorage.setItem('allFedCases', JSON.stringify(totalCases)); 
}); 







const showFavsOnly = document.getElementById('fav-Case');
showFavsOnly.addEventListener('click', function(){
  const favorites = localStorage.getItem("favoritesIsActive") || "";
if (localStorage.getItem("favoriteCases")) {
  if (!favorites.includes('IsActive')) {
    localStorage.setItem("favoritesIsActive", favorites + (favorites ? "," : "") + 'IsActive');
  } 
} else {
  alert('none added to favorites')
}
  setBackGround()
});


const caseCollections = document.getElementById('Case-Collections');
caseCollections.addEventListener('click', function(){
  const favorites = localStorage.getItem("favoritesIsActive") || "";
  if (favorites.includes('IsActive')) {
    const storageArr = favorites.split(',');
    const index = storageArr.indexOf('IsActive');
    if (index > -1) {
      storageArr.splice(index, 1);
      localStorage.setItem("favoritesIsActive", storageArr.join(','));
    }

  }
  setBackGround()
});






  const getNewCases = document.getElementById('refresh');
  getNewCases.addEventListener('click', function(){
    localStorage.clear();
    location.reload();
  });
});