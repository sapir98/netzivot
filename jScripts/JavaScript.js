var popupAudio = null;
var currentCardSoundElement = null;
var whatIsDescriptionAudio = new Audio("audio/what-is-the-commission-goal.mp3");

$(document).ready(function () {
    //פתיחה וסגירה של חלון אודות בעת לחיצה 
    $("#openAboutBTN").click(function () {
        $("#myAboutModal").modal("show");
    });
    $("#closeAboutBTN").click(function () {
        $("#myAboutModal").modal("hide");
    });

    //סגירה של חלון הסבר זכות בעת לחיצה
    $("#closeRightinfoBTN").click(function () {
        $("#Rightinfo").modal("hide");

        // אם השמע דלוק כרגע, עצור שמע ובטל סימון כפתור
        popupAudio.pause();
        $("#popup-sound-button").removeClass('bi-volume-up-fill');
        $("#popup-sound-button").addClass('bi-volume-up');

        // מבטל את סימון הפעילות של כפתור השמע בכרטיסיה הראשית
        if (currentCardSoundElement != null) {
            currentCardSoundElement.removeClass('bi-volume-up-fill');
            currentCardSoundElement.addClass('bi-volume-up');
        }
    });

    //הגדרת יכולות לטול טיפים
    $(document).tooltip({
        position: { my: "left+15 center", at: "right center" }
    });

    //לחיצה על כפתור שמע בתוך חלון קופץ
    $("#popup-sound-button").click(popUpSoundButtonClick);

    //לחיצה על כפתור שמע להקראת מהי נציבות פניות ילדים ונוער
    $("#what-is-sound-btn").click(whatIfDescriptionSoundClick);

    loadRights();//קריאה לפנוקציה הטוענת את הזכויות מתוך בסיס הנתונים

    initMap();
});

//פונקציה הטוענת את הזכויות מתוך בסיס הנתונים
function loadRights() {
    $.ajax({
        method: "POST",
        url: "Handlers/Handler.ashx",
        data: { Action: "getAllRights" }
    })
        .done(function (data) {
            fillRightCards(JSON.parse(data))

        })
        .fail(function (error) {
            fillRightCards([{ "מזהה": 1, "name": "הזכות להתפתחות אישית", "description": "מגיע לי לגור במקום שיאפשר לי לממש את היכולות שלי", "audioPath": "personal_development.mp3", "imgPath": "personal development.png" }, { "מזהה": 2, "name": "הזכות להגנה", "description": "מגיע לי להיות מוגן מפני התנהגות לא נעימה ושלא יפגעו בי או בגוף שלי", "audioPath": "protection.mp3", "imgPath": "protection.png" }, { "מזהה": 3, "name": "הזכות לקשר עם המשפחה שלי", "description": "מגיע לי לדעת מי הם אבא ואמא שלי ולדבר עם כל המשפחה שלי", "audioPath": "contact_with_family.mp3", "imgPath": "contact with family.png" }, { "מזהה": 4, "name": "הזכות ליציבות", "description": "מגיע לי לבקש עזרה כדי להישאר תמיד באותו המקום שבו אני גר", "audioPath": "stability.mp3", "imgPath": "stability.png" }, { "מזהה": 5, "name": "הזכות להשתתף בכל עניין הנוגע לי", "description": "מגיע לי לספר את מה שאני מרגיש וחושב וגם להשתתף בהחלטות שמקבלים עבורי במקום שבו אני גר", "audioPath": "emotions.mp3", "imgPath": "emotions.png" }, { "מזהה": 6, "name": "הזכות לרציפות ולזהות אישית", "description": "\tמגיע לי לגור במקום שידברו איתי בשפה שלי ונחגוג את החגים כמו שאני מכיר", "audioPath": "religion.mp3", "imgPath": "religion.png" }, { "מזהה": 7, "name": "הזכות לקבלת מידע", "description": "\tמגיע לי שיספרו לי על המצב שלי, איפה אני אגור, אילו זכויות יש לי, למי אני יכול לפנות אם פגעו בי ושישמרו עלי אם מישהו רוצה לספר לי משהו רע", "audioPath": "information.mp3", "imgPath": "information.png" }, { "מזהה": 8, "name": "הזכות לפרטיות", "description": "\tמגיע לי שישמרו על המידע האישי שלי", "audioPath": "privacy.mp3", "imgPath": "privacy.png" }, { "מזהה": 9, "name": "הזכות לחינוך", "description": "מגיע לי לגור במקום שמתאים לבית הספר שבו אני לומד", "audioPath": "education.mp3", "imgPath": "education.png" }, { "מזהה": 10, "name": "הזכות לפנאי", "description": "מגיע לי לנוח ולעשות דברים שאני אוהב \r\n(למשל: ספורט, אומנות, לשחק)", "audioPath": "leisure.mp3", "imgPath": "leisure.png" }, { "מזהה": 11, "name": "הזכות לשירותים ולהטבות", "description": "\tמגיע לי לבקש עזרה מהעיר שבה אני גר וגם מהעיר שבה אבא ואמא שלי גרים (למשל: רופא, בית ספר, חוגים)", "audioPath": "benefits.mp3", "imgPath": "benefits.png" }])
            console.log(error.statusText);
        })
}

//פונקציה שמציגה כרטיסי זכויות בהתאם לכמות הזכויות שנמצאות בבסיס הנתונים
function fillRightCards(data) {
    var box = $("#rights-box")
    for (var i = 0; i < data.length; i++) {
        box.append(
            `<div class="col-lg-4 col-sm-6 clickable inline-block card-box" id="card-${i}">
             <span class="card-top-right card-sound-button">
                    <span title="שמע">
                        <i class="sound-button bi bi-volume-up clickable" id="sound-button-${i}"></i>
                    </span>
                </span>
                <div class="item">
                    <!--סמל המתאר את הזכות -->
                    <img class="right-image" src="images/${data[i].imgPath}"/>
                    <!--כותרת הכרטיס- שם הזכות -->
                    <h3 class="right-name-title">${data[i].name}</h3>
                </div>
             </div>`
        )
        $(`#card-${i}`).click({ right: data[i], soundButton: $(`#sound-button-${i}`)}, openRightinfo);
        $(`#sound-button-${i}`).click({ right: data[i], button: `#sound-button-${i}` }, cardSoundClick);
    }
}

//פונקציה להצגת חלון הסבר על זכות בהתאם לכרטיס הזכות עליו המשתמש לחץ, התוכן היוצג בהסבר לקוח מבסיס הנתונים
function openRightinfo(event) {
    $("#Rightinfo").modal("show");
    //כותרת- שם הזכות
    $("#Rightinfo-title").text(event.data.right.name);
    //תוכן- הסבר הזכות
    $("#Rightinfo-text").text(event.data.right.description);
    //שליפת התמונה והקריינות בהתאם לנתיבים המאוכלסים בבסיס הנתונים
    //תמונה המתארת את הזכות
    $("#Rightinfo-image").attr("src", `images/${event.data.right.imgPath}`);

    // שומר את כפתור השמע של הכרטיסיה הנוכחית עבור כיבויה במידת הצורך
    currentCardSoundElement = event.data.soundButton;

    //מגדיר את השמע עבור הכרטיסיה שנלחצה אם נדרש ולא הוגדר עבור אותה זכות בעבר
    if (popupAudio == null || !popupAudio.src.includes(event.data.right.audioPath)) {
        popupAudio = new Audio(`audio/${event.data.right.audioPath}`)
    }
}

// מפעיל או מכבה את השמע עבור כרטיסיה מסוימת
function cardSoundClick(event) {
    var element = $(event.data.button);
    var popupElement = $("#popup-sound-button");

    // מגדיר את השמע עבור הכרטיסיה הנוכחית אם לא מוגדר
    if (popupAudio == null || !popupAudio.src.includes(event.data.right.audioPath)) {
        popupAudio = new Audio(`audio/${event.data.right.audioPath}`)
    }


    // אם הכפתור כבוי
    if (element.hasClass('bi-volume-up')) {
        // מפעיל את השמע
        popupAudio.play();

        // ברגע שהשמע נגמר, בטל סימון כפתור
        popupAudio.onended = () => {
            element.removeClass('bi-volume-up-fill');
            element.addClass('bi-volume-up');
            popupElement.removeClass('bi-volume-up-fill');
            popupElement.addClass('bi-volume-up');
        };

        // סמן כפתור כפעיל
        element.addClass('bi-volume-up-fill');
        element.removeClass('bi-volume-up');
        popupElement.addClass('bi-volume-up-fill');
        popupElement.removeClass('bi-volume-up');
    } else {
        // אם השמע פעיל, הפסק וסמן כלא פעיל
        popupAudio.pause();
        element.removeClass('bi-volume-up-fill');
        element.addClass('bi-volume-up');
        popupElement.removeClass('bi-volume-up-fill');
        popupElement.addClass('bi-volume-up');
    }
}

// בלחיצה על כפתור השמע בפופ-אפ, מפעיל או מכבה את האודיו
function popUpSoundButtonClick() {
    var element = $("#popup-sound-button");

    // אם השמע כבוי כרגע
    if (element.hasClass('bi-volume-up')) {
        // הפעל שמע וסמן כפתור
        popupAudio.play();

        //כאשר השמע נגמר, בטל סימון כפתור
        popupAudio.onended = () => {
            element.removeClass('bi-volume-up-fill');
            element.addClass('bi-volume-up');
        };

        element.addClass('bi-volume-up-fill');
        element.removeClass('bi-volume-up');
    } else {
        // אם השמע דלוק כרגע, עצור שמע ובטל סימון כפתור
        popupAudio.pause();
        element.removeClass('bi-volume-up-fill');
        element.addClass('bi-volume-up');

        // מבטל את סימון הפעילות של כפתור השמע בכרטיסיה הראשית
        if (currentCardSoundElement != null) {
            currentCardSoundElement.removeClass('bi-volume-up-fill');
            currentCardSoundElement.addClass('bi-volume-up');
        }
    }
}

function whatIfDescriptionSoundClick() {
    var element = $("#what-is-sound");

    // אם השמע כבוי כרגע
    if (element.hasClass('bi-volume-up')) {
        // הפעל שמע וסמן כפתור
        whatIsDescriptionAudio.play();

        //כאשר השמע נגמר, בטל סימון כפתור
        whatIsDescriptionAudio.onended = () => {
            element.removeClass('bi-volume-up-fill');
            element.addClass('bi-volume-up');
        };

        element.addClass('bi-volume-up-fill');
        element.removeClass('bi-volume-up');
    } else {
        // אם השמע דלוק כרגע, עצור שמע ובטל סימון כפתור
        whatIsDescriptionAudio.pause();
        element.removeClass('bi-volume-up-fill');
        element.addClass('bi-volume-up');
    }
}

//פונקצייה ליצירה והטמעת המפה
function initMap() {
    var mapCenter = { lat: 32.06458809323052, lng: 34.76946405396728 };//מרכוז המפה ע"פ נ"צ של משרד הנציבות
    //על אזור משרד הנציבות roadmap יצירת מפה מסוג
    var myMap = new google.maps.Map(document.getElementById("map"),
        {
            center: mapCenter,
            zoom: 15,
            mapTypeId: 'roadmap'//קביעת סוג המפה
        });
    //הוספת נקודת עניין (מרקר) במיקום משרד הנציבות
    var centerMarker = new google.maps.Marker({
        position: mapCenter,
        map: myMap,
        animation: google.maps.Animation.DROP,
        icon: centerMarkerIcon
    });
    //שינוי האייקון של המרקר  
    var centerMarkerIcon = {
        url: 'URL_TO_IMAGE ', scaledSize: new google.maps.Size(50, 50),
    };
    //למרקר, להצגת כתובת משרד הנציבות infoWindow הוספת חלון
    var createdInfowindow = new google.maps.InfoWindow({
        content: 'משרד הנציבות:<br>אחד העם 9 ת"א'
    });
    //פתיחת החלון רק בלחיצה על המרקר
    createdInfowindow.open(myMap, centerMarker);
}
