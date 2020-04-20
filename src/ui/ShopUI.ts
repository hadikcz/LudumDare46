import GameState from "core/GameState";
import GameScene from "scenes/GameScene";
import $ from 'jquery';
import animals from 'structs/animals.json';
import ArrayHelpers from "helpers/ArrayHelpers";
import {Shelfs} from "enums/Shelfs";

export default class ShopUI {

    private scene: GameScene;
    private gameState: GameState;

    constructor(scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;

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
    }

    openShop (): void {
        this.renderShop();
        $('.shop').show();
    }

    private closeShop (): void {
        $('.shop').hide();
    }

    private renderShop (): void {
        let html = '';
        let animalsArray = ArrayHelpers.objectValuesToArray(animals);
        animalsArray.forEach((animalData: any) => {
            let purchase = '';

            if (ArrayHelpers.inArray(this.gameState.getPurchasedShelfs(), animalData.shelfSlot)) {
                purchase = `<div class="bought">Bought</div>`;
            } else if (this.gameState.getBalance() <= animalData.price) {
                purchase = `<div class="no-money">Not enought money</div>`;
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

    private purchaseItem (shelf: Shelfs, price: number): void {
        console.log([price, this.gameState.getBalance()]);
        if (this.gameState.getBalance() >= price) {
            console.log('purchase');
            this.gameState.takeBalance(price);
            this.gameState.addShelf(shelf);
            this.renderShop();
        }
    }
}
