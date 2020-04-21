import GameState from "core/GameState";
import GameScene from "scenes/GameScene";
import $ from 'jquery';
import animals from 'structs/animals.json';
import ArrayHelpers from "helpers/ArrayHelpers";
import {Shelfs} from "enums/Shelfs";

export default class ShopUI {

    private scene: GameScene;
    private gameState: GameState;
    private opened: boolean = false;

    constructor(scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.scene.events.on('openshop', () => {
            this.openShop();
        });

        $('.close').on('click', () => {
            this.closeShop();
        });

        // @ts-ignore
        let self = this;
        $(document).on('click', '.purchase', function () {
            // @ts-ignore
            let shelfSlot = $(this).data('shelf-slot');
            // @ts-ignore
            let price = parseInt($(this).data('price'));
            console.log('i would like to purchase ' + shelfSlot);

            self.purchaseItem(shelfSlot, price);
        });
        this.closeShop();
    }

    update () {
        // @ts-ignore
        if ((this.scene.playerCharacter.body.velocity.x !== 0 || this.scene.playerCharacter.body.velocity.y !== 0) && this.opened) {
            // @ts-ignore
            this.closeShop();
        }
    }

    openShop (): void {
        this.renderShop();
        $('.shop').slideDown('slow');
        setTimeout(() => {
            this.opened = true;
        }, 1000);
    }

    private closeShop (): void {
        this.opened = false;
        $('.shop').slideUp('slow');
    }

    private renderShop (): void {
        let html = '';
        let animalsArray = ArrayHelpers.objectValuesToArray(animals);
        animalsArray.push({
            price: 799,
            shelfSlot: 'win',
            name: 'Employer (WIN)'
        });
        animalsArray.forEach((animalData: any) => {
            let purchase = '';

            if (ArrayHelpers.inArray(this.gameState.getPurchasedShelfs(), animalData.shelfSlot)) {
                purchase = `<div class="bought">Bought</div>`;
            } else if (this.gameState.getBalance() < animalData.price) {
                purchase = `<div class="no-money">Not enought money <br> ${animalData.price} coins</div>`;
            } else {
                purchase = `<div class="purchase" data-shelf-slot="${animalData.shelfSlot}" data-price="${animalData.price}">${animalData.price}</div>`;
            }
            html +=  `
            <div class="card">
            <div class="title">${animalData.name}</div>
                ${purchase}                
            </div>
           `;
        });

        $('#inner').html(html);
    }

    private purchaseItem (shelf: Shelfs | string, price: number): void {
        if (shelf === 'win') {
            this.closeShop();
            this.scene.scene.start('WinScene');
        } else if (this.gameState.getBalance() >= price) {
            console.log('purchase');
            this.gameState.takeBalance(price);
            // @ts-ignore
            this.gameState.addShelf(shelf);
            this.renderShop();
        }
    }
}
