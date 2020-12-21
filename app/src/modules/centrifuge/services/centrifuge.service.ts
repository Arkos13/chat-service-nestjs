import {HttpService, Injectable} from "@nestjs/common";

@Injectable()
export default class CentrifugeService {
    constructor(
        private readonly httpClient: HttpService,
    ) {}

    public async publish(channel: string, data: any): Promise<void> {
        this.httpClient.post(
            process.env.CENTRIFUGO_API_ENDPOINT,
            {
                'method': 'publish',
                'params': {
                    'channel': channel,
                    'data': data,
                }
            },
            {
                headers: {
                    'Authorization': `apikey ${process.env.CENTRIFUGO_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        ).subscribe(() => {});
    }
}