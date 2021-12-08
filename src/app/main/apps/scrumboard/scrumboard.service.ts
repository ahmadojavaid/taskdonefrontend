import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';



import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrumboardService implements Resolve<any>
{
    boards: any[];
    routeParams: any;
    board: any;

    onBoardsChanged: BehaviorSubject<any>;
    onBoardChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onBoardsChanged = new BehaviorSubject([]);
        this.onBoardChanged = new BehaviorSubject([]);
    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        // return new Promise((resolve, reject) => {
        //     Promise.all([
        //         this.getBoards()
        //     ]).then(
        //         () => {
        //             resolve();
        //         },
        //         reject
        //     );
        // });
    }


    getBoards()
    {
        // return new Promise((resolve, reject) => {
        //     this._httpClient.get('api/scrumboard-boards')
        //         .subscribe((response: any) => {
        //             this.boards = response;
        //             this.onBoardsChanged.next(this.boards);
        //             resolve(this.boards);
        //         }, reject);
        // });
    }


    getBoard(boardId)
    {
        // return new Promise((resolve, reject) => {
        //     this._httpClient.get('api/scrumboard-boards/' + boardId)
        //         .subscribe((response: any) => {
        //             this.board = response;
        //             this.onBoardChanged.next(this.board);
        //             resolve(this.board);
        //         }, reject);
        // });
    }


    addCard(listId, newCard)
    {
        // this.board.lists.map((list) => {
        //     if ( list.id === listId )
        //     {
        //         return list.idCards.push(newCard.id);
        //     }
        // });
        //
        // this.board.cards.push(newCard);
        //
        // return this.updateBoard();
    }


    addList(newList)
    {
        // this.board.lists.push(newList);
        //
        // return this.updateBoard();
    }


    removeList(listId)
    {
        // const list = this.board.lists.find((_list) => {
        //     return _list.id === listId;
        // });
        //
        // for ( const cardId of list.idCards )
        // {
        //     this.removeCard(cardId);
        // }
        //
        // const index = this.board.lists.indexOf(list);
        //
        // this.board.lists.splice(index, 1);
        //
        // return this.updateBoard();
    }


    removeCard(cardId, listId?)
    {
        // const card = this.board.cards.find((_card) => {
        //     return _card.id === cardId;
        // });
        //
        // if ( listId )
        // {
        //     const list = this.board.lists.find((_list) => {
        //         return listId === _list.id;
        //     });
        //     list.idCards.splice(list.idCards.indexOf(cardId), 1);
        // }
        //
        // this.board.cards.splice(this.board.cards.indexOf(card), 1);
        //
        // this.updateBoard();
    }



    updateBoard()
    {
        // return new Promise((resolve, reject) => {
        //     this._httpClient.post('api/scrumboard-boards/' + this.board.id, this.board)
        //         .subscribe(response => {
        //             this.onBoardChanged.next(this.board);
        //             resolve(this.board);
        //         }, reject);
        // });
    }


    updateCard(newCard)
    {
        // this.board.cards.map((_card) => {
        //     if ( _card.id === newCard.id )
        //     {
        //         return newCard;
        //     }
        // });
        //
        // this.updateBoard();
    }


    createNewBoard(board)
    {
        // return new Promise((resolve, reject) => {
        //     this._httpClient.post('api/scrumboard-boards/' + board.id, board)
        //         .subscribe(response => {
        //             resolve(board);
        //         }, reject);
        // });
    }
}

@Injectable()
export class BoardResolve implements Resolve<any>
{

    constructor(
        private _scrumboardService: ScrumboardService
    )
    {
    }

    resolve(route: ActivatedRouteSnapshot)
    {
        //return this._scrumboardService.getBoard(route.paramMap.get('boardId'));
    }
}
