import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  // private data = ["test"];  
  onApplicationBootstrap() {
    //  console.log("call to get get from ATMs API...");
  }

  //   getAppData = () =>{
  //       return this.data;
  //   }

}
