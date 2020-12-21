import {HttpModule, Module} from '@nestjs/common';
import CentrifugeService from "./services/centrifuge.service";

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        CentrifugeService,
    ],
    exports: [
       CentrifugeService,
    ]
})
export class CentrifugeModule {}
