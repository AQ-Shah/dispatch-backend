import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Get('userstats1')
  @UseGuards(JwtAuthGuard)
  getGroupChart1(@Request() req) {
  const user = req.user;

      // fake role for now
      const role = user?.role || 'dispatcher';

      let data: { title: string; count: string; series: number[]; color: string; bg: string }[] = [];

      switch (role) {
        case 'dispatcher':
          data = [
            {
              title: 'Dispatches Completed',
              count: '112',
              series: [800, 600, 1000, 1200, 900],
              color: '#00EBFF',
              bg: 'bg-[#E5F9FF] dark:bg-slate-900',
            },
            {
              title: 'Success Rate',
              count: '97%',
              series: [95, 96, 97, 97, 96],
              color: '#FB8F65',
              bg: 'bg-[#FFEDE5] dark:bg-slate-900',
            },
            {
              title: 'Fail Rate',
              count: '03%',
              series: [5, 4, 3, 3, 4],
              color: '#FB8F65',
              bg: 'bg-[#FFEDE5] dark:bg-slate-900',
            },
            {
              title: 'some other Rate',
              count: '54',
              series: [87, 96, 97, 97, 96],
              color: '#FB8F65',
              bg: 'bg-[#FFEDE5] dark:bg-slate-900',
            },
          ];
          break;

        case 'sales':
          data = [
            {
              title: 'Leads Closed',
              count: '48',
              series: [20, 25, 30, 35, 48],
              color: '#5743BE',
              bg: 'bg-[#EAE5FF] dark:bg-slate-900',
            },
            {
              title: 'Revenue Generated',
              count: '$8,300',
              series: [1000, 1800, 2500, 2900, 3300],
              color: '#00EBFF',
              bg: 'bg-[#E5F9FF] dark:bg-slate-900',
            },
          ];
          break;

        default:
          data = [
            {
              title: 'Total Users',
              count: '152',
              series: [120, 125, 130, 140, 152],
              color: '#FB8F65',
              bg: 'bg-[#FFEDE5] dark:bg-slate-900',
            },
            {
              title: 'Growth Rate',
              count: '+4.5%',
              series: [2.5, 3.0, 3.8, 4.1, 4.5],
              color: '#5743BE',
              bg: 'bg-[#EAE5FF] dark:bg-slate-900',
            },
          ];
      }

      return data;
    }

}