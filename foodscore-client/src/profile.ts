import { MapService } from "./classes/map-service";
import { UserService } from "./classes/user-service";
import { Coordinates } from "./interfaces/coordinates";
import { User } from "./interfaces/user";

const user = new UserService();
const nameBlock = document.getElementById("name") as HTMLInputElement;
const emailBlock = document.getElementById("email") as HTMLInputElement;
const image = document.getElementById("avatar") as HTMLImageElement;
const profile = document.getElementById("profileInfo") as HTMLDivElement;
const profileEdit = document.getElementById("profileForm") as HTMLDivElement;
const passwordEdit = document.getElementById("passwordForm") as HTMLDivElement;
const creator = document.getElementById("creator") as HTMLDivElement;
const cancelEditProfile = document.getElementById(
    "cancelEditProfile"
) as HTMLButtonElement;
const cancelEditPassword = document.getElementById(
    "cancelEditPassword"
) as HTMLButtonElement;
const buttonEditProfile = document.getElementById(
    "editProfile"
) as HTMLButtonElement;
const buttonEditPassword = document.getElementById(
    "editPassword"
) as HTMLButtonElement;
const buttonEditPhoto = document.getElementById(
    "photoInput"
) as HTMLInputElement;

const logOut = document.getElementById("logout") as HTMLButtonElement;
logOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.assign("./login.html");
});
let lat: number;
let lng: number;
const id = new URLSearchParams(window.location.search).get("id")
if(id === null){
    getInformationMe();
}else{
    getInformationUser();
}

async function getInformationMe() {
    const resp = await user.getInformationMe();
    user2HTML(resp);
}
async function getInformationUser() {
    const resp = await user.getInformationUser(+id!);
    user2HTML(resp);
}

function user2HTML(user: User) {
    nameBlock.replaceChildren(user.name);
    emailBlock.replaceChildren(user.email);
    image.src = user.avatar;
    lat = user.lat;
    lng = user.lng;
    showMap();
    creator.addEventListener("click", () => {
        location.assign("./index.html?creator=" + user.id);
    });
    if (!user.me) {
        buttonEditProfile.classList.add("d-none");
        buttonEditPassword.classList.add("d-none");
        buttonEditPhoto.classList.add("d-none");
    }
}


cancelEditProfile.addEventListener("click", () => {
    profile.classList.remove("d-none");
    profileEdit.classList.add("d-none");
});

cancelEditPassword.addEventListener("click", () => {
    profile.classList.remove("d-none");
    passwordEdit.classList.add("d-none");
});

buttonEditProfile.addEventListener("click", () => {
    profile.classList.add("d-none");
    profileEdit.classList.remove("d-none");
    const name2 = document.getElementById("nameInput") as HTMLInputElement;
    const email2 = document.getElementById("emailInput") as HTMLInputElement;
    name2.value = nameBlock.textContent as string;
    email2.value = emailBlock.textContent as string;

    profileEdit.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = name2.value;
        const email = email2.value;
        await user.putProfile({ name, email });
        nameBlock.textContent = name;
        emailBlock.textContent = email;
        location.reload();
    });
});

buttonEditPassword.addEventListener("click", () => {
    profile.classList.add("d-none");
    passwordEdit.classList.remove("d-none");

    passwordEdit.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newPassword = (document.getElementById(
            "password"
        ) as HTMLInputElement).value;
        const newPassword2 = (document.getElementById(
            "password2"
        ) as HTMLInputElement).value;
        if (newPassword!== newPassword2) {
            alert("Las contraseñas no coinciden");
        } else {
            await user.putPassword({ password: newPassword });
            location.reload();
        }
    });
});

buttonEditPhoto.addEventListener("change", () => {
    const protoInput = (
        document.getElementById("photoInput") as HTMLInputElement
    ).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(protoInput);
    console.log(reader.result);
    reader.addEventListener("load", async () => {
        const resp = await user.putPhoto({ avatar: reader.result as string });
        if (resp) {
            image.src = reader.result as string;
        }
    });
});


function showMap() {
    const coords: Coordinates = { latitude: lat, longitude: lng };
    const mapService = new MapService(coords, "map");
    mapService.createMarker(coords);
}
